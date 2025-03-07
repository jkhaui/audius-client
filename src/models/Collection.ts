import { ReactNode } from 'react'

import Repost from 'models/Repost'
import { CID, ID, UID } from 'models/common/Identifiers'
import { CoverArtSizes } from 'models/common/ImageSizes'
import { Nullable } from 'utils/typeUtils'

import Favorite from './Favorite'
import { UserTrackMetadata } from './Track'
import User, { UserMetadata } from './User'

export enum Variant {
  USER_GENERATED = 'user-generated',
  SMART = 'smart'
}

type PlaylistContents = {
  track_ids: Array<{ time: number; track: ID }>
}

export type CollectionMetadata = {
  blocknumber: number
  variant: Variant.USER_GENERATED
  description: Nullable<string>
  followee_reposts: Repost[]
  followee_saves: Favorite[]
  has_current_user_reposted: boolean
  has_current_user_saved: boolean
  is_album: boolean
  is_delete: boolean
  is_private: boolean
  playlist_contents: {
    track_ids: Array<{ time: number; track: ID; uid?: UID }>
  }
  tracks?: UserTrackMetadata[]
  track_count: number
  playlist_id: ID
  cover_art: CID | null
  playlist_name: string
  playlist_owner_id: ID
  repost_count: number
  save_count: number
  upc?: string | null
  updated_at: string
  activity_timestamp?: string
}

export type ComputedCollectionProperties = {
  _is_publishing?: boolean
  _marked_deleted?: boolean
  _cover_art_sizes: CoverArtSizes
  _moved?: UID
  _temp?: boolean
}

export type Collection = CollectionMetadata & ComputedCollectionProperties

export default Collection

export type UserCollectionMetadata = CollectionMetadata & { user: UserMetadata }

export type UserCollection = Collection & {
  user: User
}

export type SmartCollection = {
  variant: Variant.SMART
  playlist_name: string
  description?: string
  gradient?: string
  shadow?: string
  icon?: ReactNode
  link: string
  playlist_contents?: PlaylistContents
  has_current_user_saved?: boolean
  incentivized?: boolean // Whether we reward winners with Audio
  cardSensitivity?: number
}
