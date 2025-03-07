import { createSelector } from 'reselect'

import { UserCollection } from 'models/Collection'
import User from 'models/User'
import { getCollections } from 'store/cache/collections/selectors'
import { getUsers } from 'store/cache/users/selectors'
import { AppState, Status } from 'store/types'

const getExplore = (state: AppState) => state.application.pages.explore

export type GetExplore = {
  playlists: UserCollection[]
  profiles: User[]
  status: Status
}

export const makeGetExplore = () => {
  return createSelector(
    getExplore,
    getCollections,
    getUsers,
    (explore, collections, users) => {
      const playlists = explore.playlists
        .map(id => collections[id])
        .filter(Boolean)
        .map(collection => ({
          ...collection,
          user: users[collection.playlist_owner_id] || {}
        }))
      const profiles = explore.profiles.map(id => users[id]).filter(Boolean)
      return {
        playlists,
        profiles,
        status: explore.status
      }
    }
  )
}

export const getTab = (state: AppState) => state.application.pages.explore.tab
