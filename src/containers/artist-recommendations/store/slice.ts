import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ID } from 'models/common/Identifiers'
import { Status } from 'store/types'

const initialState: Record<ID, { relatedArtistIds: ID[]; status: Status }> = {}

const slice = createSlice({
  name: 'artist-recommendations',
  initialState,
  reducers: {
    fetchRelatedArtists: (state, action: PayloadAction<{ userId: ID }>) => {
      return {
        ...state,
        [action.payload.userId]: {
          ...state[action.payload.userId],
          status: Status.LOADING
        }
      }
    },
    fetchRelatedArtistsSucceeded: (
      state,
      action: PayloadAction<{ userId: ID; relatedArtistIds: ID[] }>
    ) => {
      return {
        ...state,
        [action.payload.userId]: {
          relatedArtistIds: action.payload.relatedArtistIds,
          status: Status.SUCCESS
        }
      }
    }
  }
})

export const {
  fetchRelatedArtists,
  fetchRelatedArtistsSucceeded
} = slice.actions
export default slice.reducer
