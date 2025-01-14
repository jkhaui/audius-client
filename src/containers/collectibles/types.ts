import { Chain } from 'store/token-dashboard/slice'
import { Nullable } from 'utils/typeUtils'

export type CollectiblesMetadata = {
  [key: string]: object
  order: string[]
}

export enum CollectibleMediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  GIF = 'GIF',
  THREE_D = 'THREE_D'
}

export type Collectible = {
  id: string
  tokenId: string
  name: Nullable<string>
  description: Nullable<string>
  mediaType: CollectibleMediaType
  frameUrl: Nullable<string>
  imageUrl: Nullable<string>
  gifUrl: Nullable<string>
  videoUrl: Nullable<string>
  threeDUrl: Nullable<string>
  isOwned: boolean
  dateCreated: Nullable<string>
  dateLastTransferred: Nullable<string>
  externalLink: Nullable<string>
  permaLink: Nullable<string>
  assetContractAddress: Nullable<string>
  chain: Chain
  wallet: string
}

export type CollectibleState = {
  [wallet: string]: Collectible[]
}
