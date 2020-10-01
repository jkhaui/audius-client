export const SET_TRACK_RANK = 'TRACK_PAGE/SET_TRACK_RANK'
export const GET_TRACK_RANKS = 'TRACK_PAGE/GET_TRACK_RANKS'
export const RESET = 'TRACK_PAGE/RESET'
export const SET_TRACK_ID = 'TRACK_PAGE/SET_TRACK_ID'
export const MAKE_TRACK_PUBLIC = 'TRACK_PAGE/MAKE_TRACK_PUBLIC'

export const FETCH_TRACK = 'TRACK_PAGE/FETCH_TRACK'
export const FETCH_TRACK_SUCCEEDED = 'TRACK_PAGE/FETCH_TRACK_SUCCEEDED'
export const FETCH_TRACK_FAILED = 'TRACK_PAGE/FETCH_TRACK_FAILED'

export const GO_TO_REMIXES_OF_PARENT_PAGE =
  'TRACK_PAGE/GO_TO_REMIXES_OF_PARENT_PAGE'

export const REFETCH_LINEUP = 'TRACK_PAGE/REFETCH_LINEUP'

export const getTrackRanks = trackId => ({ type: GET_TRACK_RANKS, trackId })
export const setTrackRank = (duration, rank) => ({
  type: SET_TRACK_RANK,
  duration,
  rank
})
export const resetTrackPage = rank => ({ type: RESET })
export const setTrackId = trackId => ({ type: SET_TRACK_ID, trackId })
export const makeTrackPublic = trackId => ({ type: MAKE_TRACK_PUBLIC, trackId })

export const fetchTrack = (trackId, trackName, ownerHandle, canBeUnlisted) => ({
  type: FETCH_TRACK,
  trackId,
  trackName,
  ownerHandle,
  canBeUnlisted
})
export const fetchTrackSucceeded = trackId => ({
  type: FETCH_TRACK_SUCCEEDED,
  trackId
})
export const fetchTrackFailed = trackId => ({ type: FETCH_TRACK_FAILED })

export const goToRemixesOfParentPage = parentTrackId => ({
  type: GO_TO_REMIXES_OF_PARENT_PAGE,
  parentTrackId
})

/**
 * Refreshes the lineup based on the track that's currently set.
 * Useful when the lineup's content depends on changes that may
 * happen to the track in view on the track page.
 */
export const refetchLineup = () => ({
  type: REFETCH_LINEUP
})