import FeedFilter from 'models/FeedFilter'
import TimeRange from 'models/TimeRange'
import { ID, PlayableType } from 'models/common/Identifiers'
import { WalletAddress } from 'store/wallet/slice'

import { MonitorPayload, ServiceMonitorType } from './serviceMonitoring'

export const ANALYTICS_TRACK_EVENT = 'ANALYTICS/TRACK_EVENT'

export enum Name {
  // Account creation
  // When the user opens the create account page
  CREATE_ACCOUNT_OPEN = 'Create Account: Open',
  // When the user continues past the email page
  CREATE_ACCOUNT_COMPLETE_EMAIL = 'Create Account: Complete Email',
  // When the user continues past the password page
  CREATE_ACCOUNT_COMPLETE_PASSWORD = 'Create Account: Complete Password',
  // When the user starts integrating with twitter
  CREATE_ACCOUNT_START_TWITTER = 'Create Account: Start Twitter',
  // When the user continues past the "twitter connection page"
  CREATE_ACCOUNT_COMPLETE_TWITTER = 'Create Account: Complete Twitter',
  // When the user continues past the "profile info page"
  CREATE_ACCOUNT_COMPLETE_PROFILE = 'Create Account: Complete Profile',
  // When the user continues past the follow page
  CREATE_ACCOUNT_COMPLETE_FOLLOW = 'Create Account: Complete Follow',
  // When the user continues past the loading page
  CREATE_ACCOUNT_COMPLETE_CREATING = 'Create Account: Complete Creating',
  // When the user continues past the entire signup modal
  CREATE_ACCOUNT_FINISH = 'Create Account: Finish',

  // Sign in
  SIGN_IN_OPEN = 'Sign In: Open',
  SIGN_IN_FINISH = 'Sign In: Finish',

  // Settings
  SETTINGS_CHANGE_THEME = 'Settings: Change Theme',
  SETTINGS_START_TWITTER_OAUTH = 'Settings: Start Twitter OAuth',
  SETTINGS_COMPLETE_TWITTER_OAUTH = 'Settings: Complete Twitter OAuth',
  SETTINGS_START_INSTAGRAM_OAUTH = 'Settings: Start Instagram OAuth',
  SETTINGS_COMPLETE_INSTAGRAM_OAUTH = 'Settings: Complete Instagram OAuth',
  SETTINGS_RESEND_ACCOUNT_RECOVERY = 'Settings: Resend Account Recovery',
  SETTINGS_LOG_OUT = 'Settings: Log Out',

  // TikTok
  TIKTOK_START_OAUTH = 'TikTok: Start TikTok OAuth',
  TIKTOK_COMPLETE_OAUTH = 'TikTok: Complete TikTok OAuth',
  TIKTOK_OAUTH_ERROR = 'TikTok: TikTok OAuth Error',
  TIKTOK_START_SHARE_SOUND = 'TikTok: Start Share Sound',
  TIKTOK_COMPLETE_SHARE_SOUND = 'TikTok: Complete Share Sound',
  TIKTOK_SHARE_SOUND_ERROR = 'TikTok: Share Sound Error',

  // Visualizer
  VISUALIZER_OPEN = 'Visualizer: Open',
  VISUALIZER_CLOSE = 'Visualizer: Close',

  // Profile completion
  ACCOUNT_HEALTH_METER_FULL = 'Account Health: Meter Full',
  ACCOUNT_HEALTH_UPLOAD_COVER_PHOTO = 'Account Health: Upload Cover Photo',
  ACCOUNT_HEALTH_UPLOAD_PROFILE_PICTURE = 'Account Health: Upload Profile Picture',
  ACCOUNT_HEALTH_DOWNLOAD_DESKTOP = 'Account Health: Download Desktop',
  ACCOUNT_HEALTH_CLICK_APP_CTA_BANNER = 'Account Health: App CTA Banner',

  // Social actions
  SHARE = 'Share',
  REPOST = 'Repost',
  UNDO_REPOST = 'Undo Repost',
  FAVORITE = 'Favorite',
  UNFAVORITE = 'Unfavorite',
  ARTIST_PICK_SELECT_TRACK = 'Artist Pick: Select Track',
  FOLLOW = 'Follow',
  UNFOLLOW = 'Unfollow',

  // Playlist creation
  PLAYLIST_ADD = 'Playlist: Add To Playlist',
  PLAYLIST_OPEN_CREATE = 'Playlist: Open Create Playlist',
  PLAYLIST_START_CREATE = 'Playlist: Start Create Playlist',
  PLAYLIST_COMPLETE_CREATE = 'Playlist: Complete Create Playlist',
  PLAYLIST_MAKE_PUBLIC = 'Playlist: Make Public',

  DELETE = 'Delete',

  // Embed
  EMBED_OPEN = 'Embed: Open modal',
  EMBED_COPY = 'Embed: Copy',

  // Upload
  TRACK_UPLOAD_OPEN = 'Track Upload: Open',
  TRACK_UPLOAD_START_UPLOADING = 'Track Upload: Start Upload',
  TRACK_UPLOAD_TRACK_UPLOADING = 'Track Upload: Track Uploading',
  TRACK_UPLOAD_COMPLETE_UPLOAD = 'Track Upload: Complete Upload',
  TRACK_UPLOAD_COPY_LINK = 'Track Upload: Copy Link',
  TRACK_UPLOAD_SHARE_WITH_FANS = 'Track Upload: Share with your fans',
  TRACK_UPLOAD_SHARE_SOUND_TO_TIKTOK = 'Track Upload: Share sound to TikTok',
  TRACK_UPLOAD_VIEW_TRACK_PAGE = 'Track Upload: View Track page',
  TRACK_UPLOAD_SUCCESS = 'Track Upload: Success',
  TRACK_UPLOAD_FAILURE = 'Track Upload: Failure',
  TWEET_FIRST_UPLOAD = 'Tweet First Upload',

  // Trending
  TRENDING_CHANGE_VIEW = 'Trending: Change view',
  TRENDING_PAGINATE = 'Trending: Fetch next page',

  // Feed
  FEED_CHANGE_VIEW = 'Feed: Change view',
  FEED_PAGINATE = 'Feed: Fetch next page',

  // Notifications
  NOTIFICATIONS_OPEN = 'Notifications: Open',
  NOTIFICATIONS_CLICK_TILE = 'Notifications: Clicked Tile',
  NOTIFICATIONS_CLICK_MILESTONE_TWITTER_SHARE = 'Notifications: Clicked Milestone Twitter Share',
  NOTIFICATIONS_CLICK_REMIX_CREATE_TWITTER_SHARE = 'Notifications: Clicked Remix Create Twitter Share',
  NOTIFICATIONS_CLICK_REMIX_COSIGN_TWITTER_SHARE = 'Notifications: Clicked Remix Co-Sign Twitter Share',
  NOTIFICATIONS_TOGGLE_SETTINGS = 'Notifications: Toggle Setting',
  BROWSER_NOTIFICATION_SETTINGS = 'Browser Push Notification',

  // Profile page
  PROFILE_PAGE_TAB_CLICK = 'Profile Page: Tab Click',
  PROFILE_PAGE_SORT = 'Profile Page: Sort',
  PROFILE_PAGE_CLICK_INSTAGRAM = 'Profile Page: Go To Instagram',
  PROFILE_PAGE_CLICK_TWITTER = 'Profile Page: Go To Twitter',
  PROFILE_PAGE_CLICK_TIKTOK = 'Profile Page: Go To TikTok',
  PROFILE_PAGE_CLICK_WEBSITE = 'ProfilePage: Go To Website',
  PROFILE_PAGE_CLICK_DONATION = 'ProfilePage: Go To Donation',
  PROFILE_PAGE_SHOWN_ARTIST_RECOMMENDATIONS = 'ProfilePage: Shown Artist Recommendations',

  // Track page
  TRACK_PAGE_DOWNLOAD = 'Track Page: Download',
  TRACK_PAGE_PLAY_MORE = 'Track Page: Play More By This Artist',

  // Playback
  PLAYBACK_PLAY = 'Playback: Play',
  PLAYBACK_PAUSE = 'Playback: Pause',
  // A listen is when we record against the backend vs. a play which is a UI action
  LISTEN = 'Listen',

  // Navigation
  PAGE_VIEW = 'Page View',
  ON_FIRST_PAGE = 'nav-on-first-page',
  NOT_ON_FIRST_PAGE = 'nav-not-on-first-page',
  LINK_CLICKING = 'Link Click',
  TAG_CLICKING = 'Tag Click',

  // Search
  SEARCH_SEARCH = 'Search: Search',
  SEARCH_TAG_SEARCH = 'Search: Tag Search',
  SEARCH_MORE_RESULTS = 'Search: More Results',
  SEARCH_RESULT_SELECT = 'Search: Result Select',
  SEARCH_TAB_CLICK = 'Search: Tab Click',

  // Errors
  ERROR_PAGE = 'Error Page',
  NOT_FOUND_PAGE = 'Not Found Page',

  // System
  WEB_VITALS = 'Web Vitals',
  PERFORMANCE = 'Performance',
  DISCOVERY_PROVIDER_SELECTION = 'Discovery Provider Selection',
  CREATOR_NODE_SELECTION = 'Creator Node Selection',

  // Remixes
  STEM_COMPLETE_UPLOAD = 'Stem: Complete Upload',
  STEM_DELETE = 'Stem: Delete',
  REMIX_NEW_REMIX = 'Remix: New Remix',
  REMIX_COSIGN = 'Remix: CoSign',
  REMIX_COSIGN_INDICATOR = 'Remix: CoSign Indicator',
  REMIX_HIDE = 'Remix: Hide',

  // $AUDIO
  SEND_AUDIO_REQUEST = 'Send $AUDIO: Request',
  SEND_AUDIO_SUCCESS = 'Send $AUDIO: Success',
  SEND_AUDIO_FAILURE = 'Send $AUDIO: Failure',

  // AUDIO Manager
  TRANSFER_AUDIO_TO_WAUDIO_REQUEST = 'TRANSFER_AUDIO_TO_WAUDIO_REQUEST',
  TRANSFER_AUDIO_TO_WAUDIO_SUCCESS = 'TRANSFER_AUDIO_TO_WAUDIO_SUCCESS',
  TRANSFER_AUDIO_TO_WAUDIO_FAILURE = 'TRANSFER_AUDIO_TO_WAUDIO_FAILURE',

  // Service monitoring
  SERVICE_MONITOR_REQUEST = 'Service Monitor: Request',
  SERVICE_MONITOR_HEALTH_CHECK = 'Service Monitor: Status',

  // Playlist library
  PLAYLIST_LIBRARY_REORDER = 'Playlist Library: Reorder',
  // When an update is available in the playlist library
  PLAYLIST_LIBRARY_HAS_UPDATE = 'Playlist Library: Has Update',
  // When a user clicks on a playlist in the library
  PLAYLIST_LIBRARY_CLICKED = 'Playlist Library: Clicked'
}

type PageView = {
  eventName: Name.PAGE_VIEW
  route: string
}

// Create Account
type CreateAccountOpen = {
  eventName: Name.CREATE_ACCOUNT_OPEN
  source:
    | 'nav profile'
    | 'nav button'
    | 'landing page'
    | 'account icon'
    | 'social action'
    | 'sign in page'
}
type CreateAccountCompleteEmail = {
  eventName: Name.CREATE_ACCOUNT_COMPLETE_EMAIL
  emailAddress: string
}
type CreateAccoutCompletePassword = {
  eventName: Name.CREATE_ACCOUNT_COMPLETE_PASSWORD
  emailAddress: string
}
type CreateAccountStartTwitter = {
  eventName: Name.CREATE_ACCOUNT_START_TWITTER
  emailAddress: string
}
type CreateAccountCompleteTwitter = {
  eventName: Name.CREATE_ACCOUNT_COMPLETE_TWITTER
  isVerified: boolean
  emailAddress: string
  handle: string
}
type CreateAccountCompleteProfile = {
  eventName: Name.CREATE_ACCOUNT_COMPLETE_PROFILE
  emailAddress: string
  handle: string
}
type CreateAccountCompleteFollow = {
  eventName: Name.CREATE_ACCOUNT_COMPLETE_FOLLOW
  emailAddress: string
  handle: string
  users: string
  count: number
}
type CreateAccountCompleteCreating = {
  eventName: Name.CREATE_ACCOUNT_COMPLETE_CREATING
  emailAddress: string
  handle: string
}
type CreateAccountOpenFinish = {
  eventName: Name.CREATE_ACCOUNT_FINISH
  emailAddress: string
  handle: string
}

// Sign In
type SignInOpen = {
  eventName: Name.SIGN_IN_OPEN
  source: 'sign up page'
}
type SignInFinish = {
  eventName: Name.SIGN_IN_FINISH
  status: 'success' | 'invalid credentials'
}

// Settings
type SettingsChangeTheme = {
  eventName: Name.SETTINGS_CHANGE_THEME
  mode: 'dark' | 'light' | 'matrix' | 'auto'
}
type SettingsStartTwitterOauth = {
  eventName: Name.SETTINGS_START_TWITTER_OAUTH
  handle: string
}
type SettingsCompleteTwitterOauth = {
  eventName: Name.SETTINGS_COMPLETE_TWITTER_OAUTH
  handle: string
  screen_name: string
  is_verified: boolean
}
type SettingsStartInstagramOauth = {
  eventName: Name.SETTINGS_START_INSTAGRAM_OAUTH
  handle: string
}
type SettingsCompleteInstagramOauth = {
  eventName: Name.SETTINGS_COMPLETE_INSTAGRAM_OAUTH
  handle: string
  username: string
  is_verified: boolean
}
type SettingsResetAccountRecovery = {
  eventName: Name.SETTINGS_RESEND_ACCOUNT_RECOVERY
}
type SettingsLogOut = {
  eventName: Name.SETTINGS_LOG_OUT
}

// TikTok
type TikTokStartOAuth = {
  eventName: Name.TIKTOK_START_OAUTH
}

type TikTokCompleteOAuth = {
  eventName: Name.TIKTOK_COMPLETE_OAUTH
}

type TikTokOAuthError = {
  eventName: Name.TIKTOK_OAUTH_ERROR
  error: string
}

type TikTokStartShareSound = {
  eventName: Name.TIKTOK_START_SHARE_SOUND
}

type TikTokCompleteShareSound = {
  eventName: Name.TIKTOK_COMPLETE_SHARE_SOUND
}

type TikTokShareSoundError = {
  eventName: Name.TIKTOK_SHARE_SOUND_ERROR
  error: string
}

// Error
type ErrorPage = {
  eventName: Name.ERROR_PAGE
}
type NotFoundPage = {
  eventName: Name.NOT_FOUND_PAGE
}

// Visualizer
type VisualizerOpen = {
  eventName: Name.VISUALIZER_OPEN
}
type VisualizerClose = {
  eventName: Name.VISUALIZER_CLOSE
}

type AccountHealthMeterFull = {
  eventName: Name.ACCOUNT_HEALTH_METER_FULL
}
type AccountHealthUploadCoverPhoto = {
  eventName: Name.ACCOUNT_HEALTH_UPLOAD_COVER_PHOTO
  source: 'original' | 'unsplash'
}
type AccountHealthUploadProfilePhoto = {
  eventName: Name.ACCOUNT_HEALTH_UPLOAD_PROFILE_PICTURE
  source: 'original' | 'unsplash'
}
type AccountHealthDownloadDesktop = {
  eventName: Name.ACCOUNT_HEALTH_DOWNLOAD_DESKTOP
  source: 'banner' | 'settings'
}

type AccountHealthCTABanner = {
  eventName: Name.ACCOUNT_HEALTH_CLICK_APP_CTA_BANNER
}

// Social
export enum ShareSource {
  TILE = 'tile',
  PAGE = 'page',
  NOW_PLAYING = 'now playing',
  OVERFLOW = 'overflow'
}
export enum RepostSource {
  TILE = 'tile',
  PLAYBAR = 'playbar',
  NOW_PLAYING = 'now playing',
  TRACK_PAGE = 'page',
  COLLECTION_PAGE = 'collection page',
  HISTORY_PAGE = 'history page',
  FAVORITES_PAGE = 'favorites page',
  OVERFLOW = 'overflow',
  TRACK_LIST = 'track list'
}
export enum FavoriteSource {
  TILE = 'tile',
  PLAYBAR = 'playbar',
  NOW_PLAYING = 'now playing',
  TRACK_PAGE = 'page',
  COLLECTION_PAGE = 'collection page',
  HISTORY_PAGE = 'history page',
  FAVORITES_PAGE = 'favorites page',
  OVERFLOW = 'overflow',
  TRACK_LIST = 'track list'
}
export enum FollowSource {
  PROFILE_PAGE = 'profile page',
  TRACK_PAGE = 'track page',
  COLLECTION_PAGE = 'collection page',
  HOVER_TILE = 'hover tile',
  OVERFLOW = 'overflow',
  USER_LIST = 'user list',
  ARTIST_RECOMMENDATIONS_POPUP = 'artist recommendations popup'
}

type Share = {
  eventName: Name.SHARE
  kind: 'profile' | 'album' | 'playlist' | 'track'
  source: ShareSource
  id: string
  url: string
}
type Repost = {
  eventName: Name.REPOST
  kind: PlayableType
  source: RepostSource
  id: string
}
type UndoRepost = {
  eventName: Name.UNDO_REPOST
  kind: PlayableType
  source: RepostSource
  id: string
}
type Favorite = {
  eventName: Name.FAVORITE
  kind: PlayableType
  source: FavoriteSource
  id: string
}
type Unfavorite = {
  eventName: Name.UNFAVORITE
  kind: PlayableType
  source: FavoriteSource
  id: string
}
type ArtistPickSelectTrack = {
  eventName: Name.ARTIST_PICK_SELECT_TRACK
  id: string
}
type Follow = {
  eventName: Name.FOLLOW
  id: string
  source: FollowSource
}
type Unfollow = {
  eventName: Name.UNFOLLOW
  id: string
  source: FollowSource
}
type TweetFirstUpload = {
  eventName: Name.TWEET_FIRST_UPLOAD
  handle: string
}

// Playlist
export enum CreatePlaylistSource {
  NAV = 'nav',
  CREATE_PAGE = 'create page',
  FROM_TRACK = 'from track',
  FAVORITES_PAGE = 'favorites page'
}

type PlaylistAdd = {
  eventName: Name.PLAYLIST_ADD
  trackId: string
  playlistId: string
}
type PlaylistOpenCreate = {
  eventName: Name.PLAYLIST_OPEN_CREATE
  source: CreatePlaylistSource
}
type PlaylistStartCreate = {
  eventName: Name.PLAYLIST_START_CREATE
  source: CreatePlaylistSource
  artworkSource: 'unsplash' | 'original'
}
type PlaylistCompleteCreate = {
  eventName: Name.PLAYLIST_COMPLETE_CREATE
  source: CreatePlaylistSource
  status: 'success' | 'failure'
}
type PlaylistMakePublic = {
  eventName: Name.PLAYLIST_MAKE_PUBLIC
  id: string
}

type Delete = {
  eventName: Name.DELETE
  kind: PlayableType
  id: string
}

// Embed
type EmbedOpen = {
  eventName: Name.EMBED_OPEN
  kind: PlayableType
  id: string
}
type EmbedCopy = {
  eventName: Name.EMBED_COPY
  kind: PlayableType
  id: string
  size: 'card' | 'compact' | 'tiny'
}

// Track Upload
type TrackUploadOpen = {
  eventName: Name.TRACK_UPLOAD_OPEN
  source: 'nav' | 'profile' | 'signup'
}
type TrackUploadStartUploading = {
  eventName: Name.TRACK_UPLOAD_START_UPLOADING
  count: number
  kind: 'tracks' | 'album' | 'playlist'
}
type TrackUploadTrackUploading = {
  eventName: Name.TRACK_UPLOAD_TRACK_UPLOADING
  artworkSource: 'unsplash' | 'original'
  genre: string
  mood: string
  downloadable: 'yes' | 'no' | 'follow'
}
type TrackUploadCompleteUpload = {
  eventName: Name.TRACK_UPLOAD_COMPLETE_UPLOAD
  count: number
  kind: 'tracks' | 'album' | 'playlist'
}

type TrackUploadSuccess = {
  eventName: Name.TRACK_UPLOAD_SUCCESS
  endpoint: string
  kind: 'single_track' | 'multi_track' | 'album' | 'playlist'
}

type TrackUploadFailure = {
  eventName: Name.TRACK_UPLOAD_FAILURE
  endpoint: string
  kind: 'single_track' | 'multi_track' | 'album' | 'playlist'
  error?: string
}

type TrackUploadCopyLink = {
  eventName: Name.TRACK_UPLOAD_COPY_LINK
  uploadType: string
  url: string
}
type TrackUploadShareWithFans = {
  eventName: Name.TRACK_UPLOAD_SHARE_WITH_FANS
  uploadType: string
  text: string
}
type TrackUploadShareSoundToTikTok = {
  eventName: Name.TRACK_UPLOAD_SHARE_SOUND_TO_TIKTOK
}
type TrackUploadViewTrackPage = {
  eventName: Name.TRACK_UPLOAD_VIEW_TRACK_PAGE
  uploadType: string
}

// Trending
type TrendingChangeView = {
  eventName: Name.TRENDING_CHANGE_VIEW
  timeframe: TimeRange
  genre: string
}
type TrendingPaginate = {
  eventName: Name.TRENDING_PAGINATE
  offset: number
  limit: number
}

// Feed
type FeedChangeView = {
  eventName: Name.FEED_CHANGE_VIEW
  view: FeedFilter
}
type FeedPaginate = {
  eventName: Name.FEED_PAGINATE
  offset: number
  limit: number
}

// Notifications
type NotificationsOpen = {
  eventName: Name.NOTIFICATIONS_OPEN
  source: 'button' | 'push notifications'
}
type NotificationsClickTile = {
  eventName: Name.NOTIFICATIONS_CLICK_TILE
  kind: string
  link_to: string
}
type NotificationsClickMilestone = {
  eventName: Name.NOTIFICATIONS_CLICK_MILESTONE_TWITTER_SHARE
  milestone: string
}
type NotificationsClickRemixCreate = {
  eventName: Name.NOTIFICATIONS_CLICK_REMIX_CREATE_TWITTER_SHARE
  text: string
}
type NotificationsClickRemixCosign = {
  eventName: Name.NOTIFICATIONS_CLICK_REMIX_COSIGN_TWITTER_SHARE
  text: string
}
type NotificationsToggleSettings = {
  eventName: Name.NOTIFICATIONS_TOGGLE_SETTINGS
  settings: string
  enabled: boolean
}

// Profile
type ProfilePageTabClick = {
  eventName: Name.PROFILE_PAGE_TAB_CLICK
  tab: 'tracks' | 'albums' | 'reposts' | 'playlists' | 'collectibles'
}
type ProfilePageSort = {
  eventName: Name.PROFILE_PAGE_SORT
  sort: 'recent' | 'popular'
}
type ProfilePageClickInstagram = {
  eventName: Name.PROFILE_PAGE_CLICK_INSTAGRAM
  handle: string
  instagramHandle: string
}
type ProfilePageClickTwitter = {
  eventName: Name.PROFILE_PAGE_CLICK_TWITTER
  handle: string
  twitterHandle: string
}
type ProfilePageClickTikTok = {
  eventName: Name.PROFILE_PAGE_CLICK_TIKTOK
  handle: string
  tikTokHandle: string
}
type ProfilePageClickWebsite = {
  eventName: Name.PROFILE_PAGE_CLICK_WEBSITE
  handle: string
  website: string
}
type ProfilePageClickDonation = {
  eventName: Name.PROFILE_PAGE_CLICK_DONATION
  handle: string
  donation: string
}
type ProfilePageShownArtistRecommendations = {
  eventName: Name.PROFILE_PAGE_SHOWN_ARTIST_RECOMMENDATIONS
  userId: number
}

// Track Page
type TrackPageDownload = {
  eventName: Name.TRACK_PAGE_DOWNLOAD
  id: ID
  category?: string
  parent_track_id?: ID
}
type TrackPagePlayMore = {
  eventName: Name.TRACK_PAGE_PLAY_MORE
  id: ID
}

// Playback
export enum PlaybackSource {
  PLAYBAR = 'playbar',
  NOW_PLAYING = 'now playing',
  PLAYLIST_PAGE = 'playlist page',
  TRACK_PAGE = 'track page',
  TRACK_TILE = 'track tile',
  PLAYLIST_TRACK = 'playlist page track list',
  PLAYLIST_TILE_TRACK = 'playlist track tile',
  HISTORY_PAGE = 'history page',
  FAVORITES_PAGE = 'favorites page',
  PASSIVE = 'passive',
  EMBED_PLAYER = 'embed player'
}

type PlaybackPlay = {
  eventName: Name.PLAYBACK_PLAY
  id?: string
  source: PlaybackSource
}
type PlaybackPause = {
  eventName: Name.PLAYBACK_PAUSE
  id?: string
  source: PlaybackSource
}

// Linking
type LinkClicking = {
  eventName: Name.LINK_CLICKING
  url: string
  source: 'profile page' | 'track page' | 'collection page'
}
type TagClicking = {
  eventName: Name.TAG_CLICKING
  tag: string
  source: 'profile page' | 'track page' | 'collection page'
}

// Search
type SearchTerm = {
  eventName: Name.SEARCH_SEARCH
  term: string
  source: 'autocomplete' | 'search results page' | 'more results page'
}

type SearchTag = {
  eventName: Name.SEARCH_TAG_SEARCH
  tag: string
  source: 'autocomplete' | 'search results page' | 'more results page'
}

type SearchMoreResults = {
  eventName: Name.SEARCH_MORE_RESULTS
  term: string
  source: 'autocomplete' | 'search results page' | 'more results page'
}

type SearchResultSelect = {
  eventName: Name.SEARCH_RESULT_SELECT
  term: string
  source: 'autocomplete' | 'search results page' | 'more results page'
  id: ID
  kind: 'track' | 'profile' | 'playlist' | 'album'
}

type SearchTabClick = {
  eventName: Name.SEARCH_TAB_CLICK
  term: string
  tab: 'people' | 'tracks' | 'albums' | 'playlists'
}
type Listen = {
  eventName: Name.LISTEN
  trackId: string
}

type OnFirstPage = {
  eventName: Name.ON_FIRST_PAGE
}

type NotOnFirstPage = {
  eventName: Name.NOT_ON_FIRST_PAGE
}

type BrowserNotificationSetting = {
  eventName: Name.BROWSER_NOTIFICATION_SETTINGS
  provider: 'safari' | 'gcm'
  enabled: boolean
}

type WebVitals = {
  eventName: Name.WEB_VITALS
  metric: string
  value: number
  route: string
}

type Performance = {
  eventName: Name.PERFORMANCE
  metric: string
  value: number
}

type DiscoveryProviderSelection = {
  eventName: Name.DISCOVERY_PROVIDER_SELECTION
  endpoint: string
  reason: string
}

type CreatorNodeSelection = {
  eventName: Name.CREATOR_NODE_SELECTION
  selectedAs: 'primary' | 'secondary'
  endpoint: string
  reason: string
}

type StemCompleteUpload = {
  eventName: Name.STEM_COMPLETE_UPLOAD
  id: number
  parent_track_id: number
  category: string
}

type StemDelete = {
  eventName: Name.STEM_DELETE
  id: number
  parent_track_id: number
}

type RemixNewRemix = {
  eventName: Name.REMIX_NEW_REMIX
  id: number
  handle: string
  title: string
  parent_track_id: number
  parent_track_title: string
  parent_track_user_handle: string
}

type RemixCosign = {
  eventName: Name.REMIX_COSIGN
  id: number
  handle: string
  action: 'reposted' | 'favorited'
  original_track_id: number
  original_track_title: string
}

type RemixCosignIndicator = {
  eventName: Name.REMIX_COSIGN_INDICATOR
  id: number
  handle: string
  action: 'reposted' | 'favorited'
  original_track_id: number
  original_track_title: string
}

type RemixHide = {
  eventName: Name.REMIX_HIDE
  id: number
  handle: string
}

type SendAudioRequest = {
  eventName: Name.SEND_AUDIO_REQUEST
  from: WalletAddress
  recipient: WalletAddress
}

type SendAudioSuccess = {
  eventName: Name.SEND_AUDIO_SUCCESS
  from: WalletAddress
  recipient: WalletAddress
}

type SendAudioFailure = {
  eventName: Name.SEND_AUDIO_FAILURE
  from: WalletAddress
  recipient: WalletAddress
  error: string
}

type TransferAudioToWAudioRequest = {
  eventName: Name.TRANSFER_AUDIO_TO_WAUDIO_REQUEST
  from: WalletAddress
}

type TransferAudioToWAudioSuccess = {
  eventName: Name.TRANSFER_AUDIO_TO_WAUDIO_SUCCESS
  from: WalletAddress
}

type TransferAudioToWAudioFailure = {
  eventName: Name.TRANSFER_AUDIO_TO_WAUDIO_FAILURE
  from: WalletAddress
}

type ServiceMonitorRequest = {
  eventName: Name.SERVICE_MONITOR_REQUEST
  type: ServiceMonitorType
} & MonitorPayload

type ServiceMonitorHealthCheck = {
  eventName: Name.SERVICE_MONITOR_HEALTH_CHECK
  type: ServiceMonitorType
} & MonitorPayload

type PlaylistLibraryReorder = {
  eventName: Name.PLAYLIST_LIBRARY_REORDER
  // Whether or not the reorder contains newly created temp playlists
  containsTemporaryPlaylists: boolean
}

type PlaylistLibraryHasUpdate = {
  eventName: Name.PLAYLIST_LIBRARY_HAS_UPDATE
  count: number
}

type PlaylistLibraryClicked = {
  eventName: Name.PLAYLIST_LIBRARY_CLICKED
  playlistId: ID
  hasUpdate: boolean
}

export type BaseAnalyticsEvent = { type: typeof ANALYTICS_TRACK_EVENT }

export type AllTrackingEvents =
  | CreateAccountOpen
  | CreateAccountCompleteEmail
  | CreateAccoutCompletePassword
  | CreateAccountStartTwitter
  | CreateAccountCompleteTwitter
  | CreateAccountCompleteProfile
  | CreateAccountCompleteFollow
  | CreateAccountCompleteCreating
  | CreateAccountOpenFinish
  | SignInOpen
  | SignInFinish
  | SettingsChangeTheme
  | SettingsStartTwitterOauth
  | SettingsCompleteTwitterOauth
  | SettingsStartInstagramOauth
  | SettingsCompleteInstagramOauth
  | SettingsResetAccountRecovery
  | SettingsLogOut
  | TikTokStartOAuth
  | TikTokCompleteOAuth
  | TikTokOAuthError
  | TikTokStartShareSound
  | TikTokCompleteShareSound
  | TikTokShareSoundError
  | VisualizerOpen
  | VisualizerClose
  | AccountHealthMeterFull
  | AccountHealthUploadCoverPhoto
  | AccountHealthUploadProfilePhoto
  | AccountHealthDownloadDesktop
  | AccountHealthCTABanner
  | Share
  | Repost
  | UndoRepost
  | Favorite
  | Unfavorite
  | ArtistPickSelectTrack
  | PlaylistAdd
  | PlaylistOpenCreate
  | PlaylistStartCreate
  | PlaylistCompleteCreate
  | PlaylistMakePublic
  | Delete
  | EmbedOpen
  | EmbedCopy
  | TrackUploadOpen
  | TrackUploadStartUploading
  | TrackUploadTrackUploading
  | TrackUploadCompleteUpload
  | TrackUploadSuccess
  | TrackUploadFailure
  | TrackUploadCopyLink
  | TrackUploadShareWithFans
  | TrackUploadShareSoundToTikTok
  | TrackUploadViewTrackPage
  | TrendingChangeView
  | TrendingPaginate
  | FeedChangeView
  | FeedPaginate
  | NotificationsOpen
  | NotificationsClickTile
  | NotificationsClickMilestone
  | NotificationsClickRemixCreate
  | NotificationsClickRemixCosign
  | NotificationsToggleSettings
  | ProfilePageTabClick
  | ProfilePageSort
  | ProfilePageClickInstagram
  | ProfilePageClickTwitter
  | ProfilePageClickTikTok
  | ProfilePageClickWebsite
  | ProfilePageClickDonation
  | ProfilePageShownArtistRecommendations
  | TrackPageDownload
  | TrackPagePlayMore
  | PlaybackPlay
  | PlaybackPause
  | Follow
  | Unfollow
  | LinkClicking
  | TagClicking
  | SearchTerm
  | SearchTag
  | SearchMoreResults
  | SearchResultSelect
  | SearchTabClick
  | Listen
  | ErrorPage
  | NotFoundPage
  | PageView
  | OnFirstPage
  | NotOnFirstPage
  | BrowserNotificationSetting
  | TweetFirstUpload
  | DiscoveryProviderSelection
  | CreatorNodeSelection
  | WebVitals
  | Performance
  | StemCompleteUpload
  | StemDelete
  | RemixNewRemix
  | RemixCosign
  | RemixCosignIndicator
  | RemixHide
  | SendAudioRequest
  | SendAudioSuccess
  | SendAudioFailure
  | ServiceMonitorRequest
  | ServiceMonitorHealthCheck
  | PlaylistLibraryReorder
  | PlaylistLibraryHasUpdate
  | PlaylistLibraryClicked
  | TransferAudioToWAudioRequest
  | TransferAudioToWAudioSuccess
  | TransferAudioToWAudioFailure
