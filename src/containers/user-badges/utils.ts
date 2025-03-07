import BN from 'bn.js'
import { createSelector } from 'reselect'

import User from 'models/User'
import { ID } from 'models/common/Identifiers'
import { getAccountUser } from 'store/account/selectors'
import { getUser } from 'store/cache/users/selectors'
import { AppState } from 'store/types'
import {
  BNAudio,
  StringAudio,
  stringAudioToBN,
  StringWei,
  stringWeiToAudioBN
} from 'store/wallet/slice'

export type BadgeTier = 'none' | 'bronze' | 'silver' | 'gold' | 'platinum'

export const badgeTiers: { tier: BadgeTier; minAudio: BNAudio }[] = [
  {
    tier: 'platinum',
    minAudio: stringAudioToBN('100000' as StringAudio)
  },
  {
    tier: 'gold',
    minAudio: stringAudioToBN('10000' as StringAudio)
  },
  {
    tier: 'silver',
    minAudio: stringAudioToBN('100' as StringAudio)
  },
  {
    tier: 'bronze',
    minAudio: stringAudioToBN('10' as StringAudio)
  },
  {
    tier: 'none',
    minAudio: stringAudioToBN('0' as StringAudio)
  }
]

// Selectors

export const getVerifiedForUser = (
  state: AppState,
  { userId }: { userId: ID }
) => {
  const user = getUser(state, { id: userId })
  return !!user?.is_verified
}

export const getWeiBalanceForUser = (
  state: AppState,
  { userId }: { userId: ID }
) => {
  const accountUser = getAccountUser(state)
  const user = getUser(state, { id: userId })

  if (accountUser?.user_id === userId && state.wallet.totalBalance) {
    return state.wallet.totalBalance
  }
  if (!user) return '0' as StringWei
  return getUserBalance(user)
}

export const makeGetTierAndVerifiedForUser = () =>
  createSelector(
    [getWeiBalanceForUser, getVerifiedForUser],
    (
      wei,
      isVerified
    ): { tier: BadgeTier; isVerified: boolean; tierNumber: number } => {
      const { tier, tierNumber } = getTierAndNumberForBalance(wei)
      return { tier, isVerified, tierNumber }
    }
  )

// Helpers

export const getTierAndNumberForBalance = (balance: StringWei) => {
  const audio = stringWeiToAudioBN(balance)

  const index = badgeTiers.findIndex(t => {
    return t.minAudio.lte(audio)
  })

  const tier = index === -1 ? 'none' : badgeTiers[index].tier
  const tierNumber = index === -1 ? 0 : 4 - index

  return { tier, tierNumber }
}

/** Gets tier number, highest tier being badgeTiers.length, lowest being 1  */
export const getTierNumber = (tier: BadgeTier) =>
  badgeTiers.length - badgeTiers.findIndex(t => t.tier === tier)

export const getUserBalance = (user: User) => {
  const userOwnerWalletBalance = user?.balance ?? ('0' as StringWei)
  const userAssociatedWalletBalance =
    user?.associated_wallets_balance ?? ('0' as StringWei)
  const total = new BN(userOwnerWalletBalance).add(
    new BN(userAssociatedWalletBalance)
  )
  return total.toString() as StringWei
}

export const getTierForUser = (user: User) => {
  const balance = getUserBalance(user)
  return getTierAndNumberForBalance(balance).tier
}
