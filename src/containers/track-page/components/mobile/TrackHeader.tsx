import React, { useCallback } from 'react'

import { Button, ButtonType, IconPause, IconPlay } from '@audius/stems'
import cn from 'classnames'
import Linkify from 'linkifyjs/react'

import placeholderArt from 'assets/img/imageBlank2x.png'
import CoSign from 'components/co-sign/CoSign'
import HoverInfo from 'components/co-sign/HoverInfo'
import { Size } from 'components/co-sign/types'
import DynamicImage from 'components/dynamic-image/DynamicImage'
import DownloadButtons from 'containers/download-buttons/DownloadButtons'
import { useFlag } from 'containers/remote-config/hooks'
import UserBadges from 'containers/user-badges/UserBadges'
import { useTrackCoverArt } from 'hooks/useImageSize'
import { FieldVisibility, Remix } from 'models/Track'
import { ID } from 'models/common/Identifiers'
import { SquareSizes, CoverArtSizes } from 'models/common/ImageSizes'
import { Name } from 'services/analytics'
import { FeatureFlags } from 'services/remote-config'
import { make, useRecord } from 'store/analytics/actions'
import { OverflowAction } from 'store/application/ui/mobileOverflowModal/types'
import { isShareToastDisabled } from 'utils/clipboardUtil'
import { squashNewLines } from 'utils/formatUtil'
import { getCannonicalName } from 'utils/genres'
import { moodMap } from 'utils/moods'
import { isDarkMode } from 'utils/theme/theme'
import { formatSeconds, formatDate } from 'utils/timeUtil'

import HiddenTrackHeader from '../HiddenTrackHeader'

import ActionButtonRow from './ActionButtonRow'
import StatsButtonRow from './StatsButtonRow'
import styles from './TrackHeader.module.css'

const messages = {
  track: 'TRACK',
  remix: 'REMIX',
  play: 'PLAY',
  pause: 'PAUSE'
}

const PlayButton = (props: { playing: boolean; onPlay: () => void }) => {
  return props.playing ? (
    <Button
      className={cn(styles.playAllButton, styles.buttonFormatting)}
      textClassName={styles.playAllButtonText}
      type={ButtonType.PRIMARY_ALT}
      text={messages.pause}
      leftIcon={<IconPause />}
      onClick={props.onPlay}
    />
  ) : (
    <Button
      className={cn(styles.playAllButton, styles.buttonFormatting)}
      textClassName={styles.playAllButtonText}
      type={ButtonType.PRIMARY_ALT}
      text={messages.play}
      leftIcon={<IconPlay />}
      onClick={props.onPlay}
    />
  )
}

type TrackHeaderProps = {
  isLoading: boolean
  isPlaying: boolean
  isOwner: boolean
  isSaved: boolean
  isReposted: boolean
  isFollowing: boolean
  title: string
  trackId: ID
  userId: ID
  coverArtSizes: CoverArtSizes | null
  artistName: string
  artistVerified: boolean
  description: string
  released: string
  genre: string
  mood: string
  credits: string
  tags: string
  listenCount: number
  duration: number
  saveCount: number
  repostCount: number
  isUnlisted: boolean
  isRemix: boolean
  fieldVisibility: FieldVisibility
  coSign: Remix | null
  onClickTag: (tag: string) => void
  onClickArtistName: () => void
  onClickMobileOverflow: (
    trackId: ID,
    overflowActions: OverflowAction[]
  ) => void
  onPlay: () => void
  onShare: () => void
  onSave: () => void
  onRepost: () => void
  goToFavoritesPage: (trackId: ID) => void
  goToRepostsPage: (trackId: ID) => void
}

const TrackHeader = ({
  title,
  trackId,
  userId,
  coverArtSizes,
  artistName,
  artistVerified,
  description,
  isOwner,
  isFollowing,
  released,
  duration,
  isLoading,
  isPlaying,
  isSaved,
  isReposted,
  isUnlisted,
  isRemix,
  fieldVisibility,
  coSign,
  saveCount,
  repostCount,
  listenCount,
  mood,
  credits,
  genre,
  tags,
  onClickArtistName,
  onClickTag,
  onPlay,
  onShare,
  onSave,
  onRepost,
  onClickMobileOverflow,
  goToFavoritesPage,
  goToRepostsPage
}: TrackHeaderProps) => {
  const { isEnabled: isShareSoundToTikTokEnabled } = useFlag(
    FeatureFlags.SHARE_SOUND_TO_TIKTOK
  )
  const image = useTrackCoverArt(
    trackId,
    coverArtSizes,
    SquareSizes.SIZE_480_BY_480
  )
  const onSaveHeroTrack = () => {
    if (!isOwner) onSave()
  }
  const filteredTags = (tags || '').split(',').filter(Boolean)

  const trackLabels: { value: any; label: string }[] = [
    { value: formatSeconds(duration), label: 'Duration' },
    { value: getCannonicalName(genre), label: 'Genre' },
    { value: formatDate(released), label: 'Released' },
    {
      // @ts-ignore
      value: mood && mood in moodMap ? moodMap[mood] : mood,
      label: 'Mood'
    },
    { value: credits, label: 'Credit' }
  ].filter(info => !!info.value)

  const record = useRecord()
  const onExternalLinkClick = useCallback(
    event => {
      record(
        make(Name.LINK_CLICKING, {
          url: event.target.href,
          source: 'track page' as const
        })
      )
    },
    [record]
  )

  const onClickOverflow = () => {
    const overflowActions = [
      isOwner || isUnlisted
        ? null
        : isReposted
        ? OverflowAction.UNREPOST
        : OverflowAction.REPOST,
      isOwner || isUnlisted
        ? null
        : isSaved
        ? OverflowAction.UNFAVORITE
        : OverflowAction.FAVORITE,
      isUnlisted && !fieldVisibility.share ? null : OverflowAction.SHARE,
      isShareSoundToTikTokEnabled && isOwner && !isUnlisted
        ? OverflowAction.SHARE_TO_TIKTOK
        : null,
      OverflowAction.ADD_TO_PLAYLIST,
      isFollowing
        ? OverflowAction.UNFOLLOW_ARTIST
        : OverflowAction.FOLLOW_ARTIST,
      OverflowAction.VIEW_ARTIST_PAGE
    ].filter(Boolean) as OverflowAction[]

    onClickMobileOverflow(trackId, overflowActions)
  }

  const renderTags = () => {
    if (isUnlisted && !fieldVisibility.tags) return null
    return (
      <>
        {filteredTags.length > 0 ? (
          <div className={styles.tags}>
            {filteredTags.map(tag => (
              <h2
                key={tag}
                onClick={() => onClickTag(tag)}
                className={styles.tag}
              >
                {tag}
              </h2>
            ))}
          </div>
        ) : null}
      </>
    )
  }

  const renderHiddenDownloadButtons = () => {
    return (
      <DownloadButtons
        isHidden
        trackId={trackId}
        isOwner={isOwner}
        following={isFollowing}
        // Downloads not supported on mobile, do nothing
        onDownload={() => {}}
      />
    )
  }

  const renderTrackLabels = () => {
    return trackLabels.map(infoFact => {
      if (infoFact.label === 'Genre' && isUnlisted && !fieldVisibility.genre)
        return null
      if (infoFact.label === 'Released' && isUnlisted) return null
      if (infoFact.label === 'Mood' && isUnlisted && !fieldVisibility.mood)
        return null
      return (
        <div key={infoFact.label} className={styles.infoFact}>
          <h2 className={styles.infoLabel}>{infoFact.label}</h2>
          <h2 className={styles.infoValue}>{infoFact.value}</h2>
        </div>
      )
    })
  }

  const onClickFavorites = useCallback(() => {
    goToFavoritesPage(trackId)
  }, [goToFavoritesPage, trackId])

  const onClickReposts = useCallback(() => {
    goToRepostsPage(trackId)
  }, [goToRepostsPage, trackId])

  const imageElement = coSign ? (
    <CoSign
      size={Size.LARGE}
      hasFavorited={coSign.has_remix_author_saved}
      hasReposted={coSign.has_remix_author_reposted}
      coSignName={coSign.user.name}
      className={styles.coverArt}
      userId={coSign.user.user_id}
    >
      <DynamicImage image={image} wrapperClassName={styles.imageWrapper} />
    </CoSign>
  ) : (
    <DynamicImage
      image={image}
      wrapperClassName={cn(styles.coverArt, styles.imageWrapper)}
    />
  )

  return (
    <div className={styles.trackHeader}>
      {isUnlisted ? (
        <div className={styles.hiddenTrackHeaderWrapper}>
          <HiddenTrackHeader />
        </div>
      ) : (
        <div className={styles.typeLabel}>
          {isRemix ? messages.remix : messages.track}
        </div>
      )}
      {imageElement}
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.artist} onClick={onClickArtistName}>
        <h2>{artistName}</h2>
        <UserBadges
          className={styles.verified}
          badgeSize={16}
          userId={userId}
        />
      </div>
      <div className={styles.buttonSection}>
        <PlayButton playing={isPlaying} onPlay={onPlay} />
        <ActionButtonRow
          showRepost={!isUnlisted}
          showFavorite={!isUnlisted}
          showShare={!isUnlisted || fieldVisibility.share}
          showOverflow
          shareToastDisabled={isShareToastDisabled}
          isOwner={isOwner}
          isReposted={isReposted}
          isSaved={isSaved}
          onClickOverflow={onClickOverflow}
          onRepost={onRepost}
          onFavorite={onSaveHeroTrack}
          onShare={onShare}
          darkMode={isDarkMode()}
        />
      </div>
      {coSign && (
        <div className={styles.coSignInfo}>
          <HoverInfo
            coSignName={coSign.user.name}
            hasFavorited={coSign.has_remix_author_saved}
            hasReposted={coSign.has_remix_author_reposted}
            userId={coSign.user.user_id}
          />
        </div>
      )}
      <StatsButtonRow
        showListenCount={!isUnlisted || fieldVisibility.play_count}
        showFavoriteCount={!isUnlisted}
        showRepostCount={!isUnlisted}
        listenCount={listenCount}
        favoriteCount={saveCount}
        repostCount={repostCount}
        onClickFavorites={onClickFavorites}
        onClickReposts={onClickReposts}
      />
      {description ? (
        // https://github.com/Soapbox/linkifyjs/issues/292
        // @ts-ignore
        <Linkify options={{ attributes: { onClick: onExternalLinkClick } }}>
          <h3 className={styles.description}>{squashNewLines(description)}</h3>
        </Linkify>
      ) : null}
      <div
        className={cn(styles.infoSection, {
          [styles.noStats]: isUnlisted && !fieldVisibility.play_count
        })}
      >
        {renderTrackLabels()}
      </div>
      {renderTags()}
      {renderHiddenDownloadButtons()}
    </div>
  )
}

TrackHeader.defaultProps = {
  loading: false,
  playing: false,
  active: true,
  coverArtUrl: placeholderArt,
  artistVerified: false,
  description: '',

  isOwner: false,
  isAlbum: false,
  hasTracks: false,
  isPublished: false,
  isSaved: false,

  saveCount: 0,
  tags: [],
  onPlay: () => {}
}

export default TrackHeader
