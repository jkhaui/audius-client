import React, { PureComponent } from 'react'

import {
  push as pushRoute,
  replace as replaceRoute
} from 'connected-react-router'
import { connect } from 'react-redux'
import { withRouter, matchPath } from 'react-router-dom'

import {
  getDiscoverFeedLineup,
  makeGetSuggestedFollows,
  getFeedFilter
} from 'containers/feed-page/store/selectors'
import { openSignOn } from 'containers/sign-on/store/actions'
import { Name } from 'services/analytics'
import { getHasAccount } from 'store/account/selectors'
import { make } from 'store/analytics/actions'
import { makeGetLineupMetadatas } from 'store/lineup/selectors'
import { getPlaying, getBuffering } from 'store/player/selectors'
import { makeGetCurrent } from 'store/queue/selectors'
import { isMobile } from 'utils/clientUtil'
import { getPathname, TRENDING_PAGE } from 'utils/route'

import * as discoverPageAction from './store/actions'
import { feedActions } from './store/lineups/feed/actions'

const messages = {
  feedTitle: 'Feed',
  feedDescription: 'Listen to what people you follow are sharing'
}

/**
 *  FeedPageProvider encapsulates the buisness logic
 *  around a connected FeedPage, injecting props into
 *  children as `FeedPageContentProps`.
 */
class FeedPageProvider extends PureComponent {
  goToTrending = () => {
    this.props.history.push({
      pathname: TRENDING_PAGE
    })
  }

  goToSignUp = () => {
    this.props.openSignOn(false)
  }

  matchesRoute = route => {
    return matchPath(getPathname(), {
      path: route
    })
  }

  componentWillUnmount() {
    // Only reset to if we're not on mobile (mobile should
    // preserve the current tab + state) or there was no
    // account (because the lineups could contain stale content).
    if (!this.props.isMobile || !this.props.hasAccount) {
      this.props.resetFeedLineup()
    }
  }

  getLineupProps = lineup => {
    const { currentQueueItem, playing, buffering } = this.props
    const { uid: playingUid, track, source } = currentQueueItem
    return {
      lineup,
      playingUid,
      playingSource: source,
      playingTrackId: track ? track.track_id : null,
      playing: playing,
      buffering: buffering,
      scrollParent: this.props.containerRef,
      selfLoad: true
    }
  }

  render() {
    const childProps = {
      feedTitle: messages.feedTitle,
      feedDescription: messages.feedDescription,
      feedIsMain: this.props.feedIsMain,
      feed: this.props.feed,

      fetchSuggestedFollowUsers: this.props.fetchSuggestedFollowUsers,
      followUsers: this.props.followUsers,
      suggestedFollows: this.props.suggestedFollows,
      refreshFeedInView: this.props.refreshFeedInView,
      hasAccount: this.props.hasAccount,
      goToSignUp: this.goToSignUp,
      goToGenreSelection: this.goToGenreSelection,
      setFeedInView: this.props.setFeedInView,
      loadMoreFeed: this.props.loadMoreFeed,
      playFeedTrack: this.props.playFeedTrack,
      pauseFeedTrack: this.props.pauseFeedTrack,
      switchView: this.switchView,
      getLineupProps: this.getLineupProps,
      setFeedFilter: this.props.setFeedFilter,
      feedFilter: this.props.feedFilter,
      resetFeedLineup: this.props.resetFeedLineup,

      makeLoadMore: this.props.makeLoadMore,
      makePlayTrack: this.props.makePlayTrack,
      makePauseTrack: this.props.makePauseTrack,
      makeSetInView: this.props.makeSetInView
    }

    return <this.props.children {...childProps} />
  }
}

const makeMapStateToProps = () => {
  const getCurrentQueueItem = makeGetCurrent()
  const getSuggestedFollows = makeGetSuggestedFollows()
  const getFeedLineup = makeGetLineupMetadatas(getDiscoverFeedLineup)

  const mapStateToProps = state => ({
    hasAccount: getHasAccount(state),
    feed: getFeedLineup(state),
    suggestedFollows: getSuggestedFollows(state),
    currentQueueItem: getCurrentQueueItem(state),
    playing: getPlaying(state),
    buffering: getBuffering(state),
    feedFilter: getFeedFilter(state),
    isMobile: isMobile()
  })
  return mapStateToProps
}

const mapDispatchToProps = dispatch => ({
  dispatch,
  openSignOn: signIn => dispatch(openSignOn(signIn)),
  resetFeedLineup: () => dispatch(feedActions.reset()),
  fetchSuggestedFollowUsers: () =>
    dispatch(discoverPageAction.fetchSuggestedFollowUsers()),
  goToRoute: route => dispatch(pushRoute(route)),
  replaceRoute: route => dispatch(replaceRoute(route)),
  followUsers: userIds => dispatch(discoverPageAction.followUsers(userIds)),
  setFeedFilter: filter => dispatch(discoverPageAction.setFeedFilter(filter)),

  // Feed Lineup Actions
  setFeedInView: inView => dispatch(feedActions.setInView(inView)),
  loadMoreFeed: (offset, limit, overwrite) => {
    dispatch(feedActions.fetchLineupMetadatas(offset, limit, overwrite))
    const trackEvent = make(Name.FEED_PAGINATE, { offset, limit })
    dispatch(trackEvent)
  },
  refreshFeedInView: (overwrite, limit) =>
    dispatch(feedActions.refreshInView(overwrite, null, limit)),
  playFeedTrack: uid => dispatch(feedActions.play(uid)),
  pauseFeedTrack: () => dispatch(feedActions.pause())
})

export default withRouter(
  connect(makeMapStateToProps, mapDispatchToProps)(FeedPageProvider)
)
