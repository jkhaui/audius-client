import { matchPath } from 'react-router-dom'

import { TabRoute } from 'containers/profile-page/store/types'
import { ID } from 'models/common/Identifiers'
import { USER_ID_PAGE, PROFILE_PAGE, staticRoutes } from 'utils/route'

import { decodeHashId } from './hashIds'

type UserRouteParams =
  | { handle: string; userId: null; tab: null }
  | { handle: string; userId: null; tab: TabRoute }
  | { handle: null; userId: ID; tab: null }
  | null

/**
 * Parses a user route into handle or id
 * @param route
 */
export const parseUserRoute = (route: string): UserRouteParams => {
  if (staticRoutes.has(route)) return null

  const userIdPageMatch = matchPath<{ id: string }>(route, {
    path: USER_ID_PAGE,
    exact: true
  })
  if (userIdPageMatch) {
    const userId = decodeHashId(userIdPageMatch.params.id)
    if (userId === null) return null
    return { userId, handle: null, tab: null }
  }

  const profilePageMatch = matchPath<{ handle: string }>(route, {
    path: PROFILE_PAGE,
    exact: true
  })
  if (profilePageMatch) {
    const { handle } = profilePageMatch.params
    return { handle, userId: null, tab: null }
  }

  const profilePageTabMatch = matchPath<{ handle: string; tab: TabRoute }>(
    route,
    {
      path: `${PROFILE_PAGE}/:tab`,
      exact: true
    }
  )
  if (profilePageTabMatch) {
    const { handle, tab } = profilePageTabMatch.params
    if (
      tab === 'tracks' ||
      tab === 'albums' ||
      tab === 'playlists' ||
      tab === 'reposts' ||
      tab === 'collectibles'
    ) {
      return { handle, userId: null, tab }
    }
  }

  return null
}
