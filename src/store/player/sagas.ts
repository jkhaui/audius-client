import { delay, eventChannel, END } from 'redux-saga'
import { select, take, call, put, spawn, takeLatest } from 'redux-saga/effects'

import apiClient from 'services/audius-api-client/AudiusAPIClient'
import { getRemoteVar, StringKeys } from 'services/remote-config'
import * as cacheActions from 'store/cache/actions'
import { getTrack } from 'store/cache/tracks/selectors'
import { getUser } from 'store/cache/users/selectors'
import {
  getAudio,
  getTrackId,
  getUid,
  getCounter,
  getPlaying
} from 'store/player/selectors'
import {
  setAudioStream as setAudioStreamAction,
  play,
  playSucceeded,
  pause,
  stop,
  setBuffering,
  reset,
  resetSuceeded,
  seek,
  error as errorAction
} from 'store/player/slice'
import * as queueActions from 'store/queue/slice'
import { recordListen } from 'store/social/tracks/actions'
import { Kind } from 'store/types'
import { getCreatorNodeIPFSGateways } from 'utils/gatewayUtil'
import { encodeHashId } from 'utils/route/hashIds'
import { actionChannelDispatcher, waitForValue } from 'utils/sagaHelpers'

import errorSagas from './errorSagas'

const NATIVE_MOBILE = process.env.REACT_APP_NATIVE_MOBILE

const PLAYER_SUBSCRIBER_NAME = 'PLAYER'
const RECORD_LISTEN_SECONDS = 1
const RECORD_LISTEN_INTERVAL = 1000

function* setAudioStream() {
  if (!NATIVE_MOBILE) {
    const chan = eventChannel(emitter => {
      import('audio/AudioStream').then(AudioStream => {
        emitter(AudioStream.default)
        emitter(END)
      })
      return () => {}
    })
    const AudioStream = yield take(chan)
    yield put(setAudioStreamAction({ audio: new AudioStream() }))
  }
}

// Set of track ids that should be forceably streamed as mp3 rather than hls because
// their hls maybe corrupt.
let FORCE_MP3_STREAM_TRACK_IDS: Set<string> | null = null

export function* watchPlay() {
  yield takeLatest(play.type, function* (action: ReturnType<typeof play>) {
    const { uid, trackId, onEnd } = action.payload

    if (!FORCE_MP3_STREAM_TRACK_IDS) {
      FORCE_MP3_STREAM_TRACK_IDS = new Set(
        (getRemoteVar(StringKeys.FORCE_MP3_STREAM_TRACK_IDS) || '').split(',')
      )
    }

    const audio = yield call(waitForValue, getAudio)

    if (trackId) {
      // Load and set end action.
      const track = yield select(getTrack, { id: trackId })
      const owner = yield select(getUser, { id: track.owner_id })
      const gateways = owner
        ? getCreatorNodeIPFSGateways(owner.creator_node_endpoint)
        : []
      const encodedTrackId = encodeHashId(trackId)
      const forceStreamMp3 =
        encodedTrackId && FORCE_MP3_STREAM_TRACK_IDS.has(encodedTrackId)
      const forceStreamMp3Url = forceStreamMp3
        ? apiClient.makeUrl(`/tracks/${encodedTrackId}/stream`)
        : null

      const endChannel = eventChannel(emitter => {
        audio.load(
          track.track_segments,
          () => {
            if (onEnd) {
              emitter(onEnd({}))
            }
          },
          [track._first_segment],
          gateways,
          {
            id: encodedTrackId,
            title: track.title,
            artist: owner.name
          },
          forceStreamMp3Url
        )
        return () => {}
      })
      yield spawn(actionChannelDispatcher, endChannel)
      yield put(
        cacheActions.subscribe(Kind.TRACKS, [
          { uid: PLAYER_SUBSCRIBER_NAME, id: trackId }
        ])
      )
    }
    // Play.
    audio.play()
    yield put(playSucceeded({ uid, trackId }))
  })
}

export function* watchPause() {
  yield takeLatest(pause.type, function* (action: ReturnType<typeof pause>) {
    const { onlySetState } = action.payload

    const audio = yield call(waitForValue, getAudio)
    if (onlySetState) return
    audio.pause()
  })
}

export function* watchReset() {
  yield takeLatest(reset.type, function* (action: ReturnType<typeof reset>) {
    const { shouldAutoplay } = action.payload

    const audio = yield call(waitForValue, getAudio)
    audio.seek(0)
    if (!shouldAutoplay) {
      audio.pause()
    } else {
      const playerUid = yield select(getUid)
      const playerTrackId = yield select(getTrackId)
      yield put(
        play({
          uid: playerUid,
          trackId: playerTrackId,
          onEnd: queueActions.next
        })
      )
    }
    yield put(resetSuceeded({ shouldAutoplay }))
  })
}

export function* watchStop() {
  yield takeLatest(stop.type, function* (action: ReturnType<typeof stop>) {
    const id = yield select(getTrackId)
    yield put(
      cacheActions.unsubscribe(Kind.TRACKS, [
        { uid: PLAYER_SUBSCRIBER_NAME, id }
      ])
    )
    const audio = yield call(waitForValue, getAudio)
    audio.stop()
  })
}

export function* watchSeek() {
  yield takeLatest(seek.type, function* (action: ReturnType<typeof seek>) {
    const { seconds } = action.payload

    const audio = yield call(waitForValue, getAudio)
    audio.seek(seconds)
  })
}

// NOTE: Event listeners are attached to the audio object b/c the audio can be manipulated
// directly by the browser & not via the ui or hot keys. If the event listener is triggered
// and the playing field does not match audio, then dispatch an action to update the store.
const AudioEvents = Object.freeze({
  PLAY: 'play',
  PAUSE: 'pause'
})

export function* setAudioListeners() {
  const audioStream = yield call(waitForValue, getAudio)
  const chan = yield call(watchAudio, audioStream.audio)
  while (true) {
    const audioEvent = yield take(chan)
    const playing = yield select(getPlaying)
    if (audioEvent === AudioEvents.PLAY && !playing) {
      yield put(play({}))
    } else if (audioEvent === AudioEvents.PAUSE && playing) {
      yield put(pause({}))
    }
  }
}

export function* handleAudioBuffering() {
  const audioStream = yield call(waitForValue, getAudio)
  const chan = eventChannel(emitter => {
    audioStream.onBufferingChange = (isBuffering: boolean) => {
      emitter(setBuffering({ buffering: isBuffering }))
    }
    return () => {}
  })
  yield spawn(actionChannelDispatcher, chan)
}

export function* handleAudioErrors() {
  // Watch for audio errors and emit an error saga dispatching action
  const audioStream = yield call(waitForValue, getAudio)
  const chan = eventChannel(emitter => {
    audioStream.onError = (error: any, data: string) => {
      emitter({ error, data })
    }
    return () => {}
  })
  while (true) {
    const { error, data } = yield take(chan)
    const trackId = yield select(getTrackId)
    yield put(errorAction({ error, trackId, info: data }))
  }
}

function watchAudio(audio: HTMLAudioElement) {
  return eventChannel(emitter => {
    const emitPlay = () => emitter(AudioEvents.PLAY)
    const emitPause = () => {
      if (!audio.ended) {
        emitter(AudioEvents.PAUSE)
      }
    }

    if (audio) {
      audio.addEventListener(AudioEvents.PLAY, emitPlay)
      audio.addEventListener(AudioEvents.PAUSE, emitPause)
    }

    return () => {
      if (audio) {
        audio.removeEventListener(AudioEvents.PLAY, emitPlay)
        audio.removeEventListener(AudioEvents.PAUSE, emitPause)
      }
    }
  })
}

/**
 * Poll for whether a track has been listened to.
 */
function* recordListenWorker() {
  // Store the last seen play counter to make sure we only record
  // a listen for each "unique" track play. Using an id here wouldn't
  // be enough because the user might have "repeat single" mode turned on.
  let lastSeenPlayCounter = null
  while (true) {
    const trackId = yield select(getTrackId)
    const playCounter = yield select(getCounter)
    const audio = yield call(waitForValue, getAudio)
    const position = audio.getPosition()

    const newPlay = lastSeenPlayCounter !== playCounter

    if (newPlay && position > RECORD_LISTEN_SECONDS) {
      yield put(recordListen(trackId))
      lastSeenPlayCounter = playCounter
    }
    yield delay(RECORD_LISTEN_INTERVAL)
  }
}

const sagas = () => {
  return [
    setAudioStream,
    watchPlay,
    watchPause,
    watchStop,
    watchReset,
    watchSeek,
    setAudioListeners,
    handleAudioErrors,
    handleAudioBuffering,
    recordListenWorker,
    errorSagas
  ]
}

export default sagas
