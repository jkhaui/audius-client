import { takeEvery, put, call, select } from 'redux-saga/effects'

import { setSmartCollection } from 'containers/collection-page/store/actions'
import Track, { TrackMetadata } from 'models/Track'
import { ID } from 'models/common/Identifiers'
import Explore from 'services/audius-backend/Explore'
import { getAccountStatus, getUserId } from 'store/account/selectors'
import { waitForBackendSetup } from 'store/backend/sagas'
import { processAndCacheTracks } from 'store/cache/tracks/utils'
import { fetchUsers } from 'store/cache/users/sagas'
import { getLuckyTracks } from 'store/recommendation/sagas'
import { Status } from 'store/types'
import { EXPLORE_PAGE } from 'utils/route'
import { requiresAccount, waitForValue } from 'utils/sagaHelpers'

import {
  HEAVY_ROTATION,
  BEST_NEW_RELEASES,
  MOST_LOVED,
  FEELING_LUCKY,
  UNDER_THE_RADAR,
  REMIXABLES
} from '../smartCollections'
import { SmartCollectionVariant } from '../types'

import { fetchSmartCollection, fetchSmartCollectionSucceeded } from './slice'

const COLLECTIONS_LIMIT = 25

function* fetchHeavyRotation() {
  const topListens = yield call(Explore.getTopUserListens)

  const trackIds = topListens.map((listen: any) => ({
    track: listen.trackId
  }))

  return {
    ...HEAVY_ROTATION,
    playlist_contents: {
      track_ids: trackIds
    }
  }
}

function* fetchBestNewReleases() {
  const tracks = yield call(Explore.getTopFolloweeTracksFromWindow, 'month')

  const trackIds = tracks.map((track: Track) => ({
    time: track.created_at,
    track: track.track_id
  }))

  yield call(processAndCacheTracks, tracks)

  return {
    ...BEST_NEW_RELEASES,
    playlist_contents: {
      track_ids: trackIds
    }
  }
}

function* fetchUnderTheRadar() {
  const tracks = yield call(Explore.getFeedNotListenedTo)

  const trackIds = tracks.map((track: Track) => ({
    time: track.activity_timestamp,
    track: track.track_id
  }))

  yield call(processAndCacheTracks, tracks)

  // feed minus listened
  return {
    ...UNDER_THE_RADAR,
    playlist_contents: {
      track_ids: trackIds
    }
  }
}

function* fetchMostLoved() {
  const tracks = yield call(Explore.getTopFolloweeSaves)

  const trackIds = tracks.map((track: Track) => ({
    time: track.created_at,
    track: track.track_id
  }))

  yield call(processAndCacheTracks, tracks)

  return {
    ...MOST_LOVED,
    playlist_contents: {
      track_ids: trackIds
    }
  }
}

function* fetchFeelingLucky() {
  const tracks = yield call(getLuckyTracks, COLLECTIONS_LIMIT)

  const trackIds = tracks.map((track: Track) => ({
    time: track.created_at,
    track: track.track_id
  }))

  return {
    ...FEELING_LUCKY,
    playlist_contents: {
      track_ids: trackIds
    }
  }
}

function* fetchRemixables() {
  const currentUserId: ID = yield select(getUserId)
  const tracks: TrackMetadata[] = yield call(
    Explore.getRemixables,
    currentUserId,
    75 // limit
  )

  // Limit the number of times an artist can appear
  const artistLimit = 3
  const artistCount: Record<number, number> = {}

  const filteredTracks = tracks.filter(trackMetadata => {
    const id = trackMetadata.owner_id
    if (!artistCount[id]) artistCount[id] = 0
    artistCount[id]++
    return artistCount[id] <= artistLimit
  })

  const processedTracks: Track[] = yield call(
    processAndCacheTracks,
    filteredTracks.slice(0, COLLECTIONS_LIMIT)
  )

  const trackIds = processedTracks.map((track: Track) => ({
    time: track.created_at,
    track: track.track_id
  }))

  // Fetch the users for the tracks
  // TODO: Remove when remixables query is updated
  const userIds = processedTracks.map((track: Track) => track.owner_id)
  yield call(fetchUsers, userIds)

  return {
    ...REMIXABLES,
    playlist_contents: {
      track_ids: trackIds
    }
  }
}

const fetchMap = {
  [SmartCollectionVariant.HEAVY_ROTATION]: requiresAccount(
    fetchHeavyRotation,
    EXPLORE_PAGE
  ),
  [SmartCollectionVariant.BEST_NEW_RELEASES]: requiresAccount(
    fetchBestNewReleases,
    EXPLORE_PAGE
  ),
  [SmartCollectionVariant.UNDER_THE_RADAR]: requiresAccount(
    fetchUnderTheRadar,
    EXPLORE_PAGE
  ),
  [SmartCollectionVariant.MOST_LOVED]: requiresAccount(
    fetchMostLoved,
    EXPLORE_PAGE
  ),
  [SmartCollectionVariant.FEELING_LUCKY]: fetchFeelingLucky,
  [SmartCollectionVariant.REMIXABLES]: fetchRemixables
}

function* watchFetch() {
  yield takeEvery(fetchSmartCollection.type, function* (
    action: ReturnType<typeof fetchSmartCollection>
  ) {
    yield call(waitForBackendSetup)
    yield call(
      waitForValue,
      getAccountStatus,
      {},
      status => status !== Status.LOADING
    )

    const { variant } = action.payload

    const collection = yield call(fetchMap[variant])

    yield put(
      fetchSmartCollectionSucceeded({
        variant,
        collection
      })
    )
    yield put(setSmartCollection(variant))
  })
}

export default function sagas() {
  return [watchFetch]
}
