import { makeReducer, ActionsMap } from 'utils/reducer'

import { OPEN, CLOSE } from './actions'
import { OverflowSource, MobileOverflowModalState } from './types'

const initialState: MobileOverflowModalState = {
  isOpen: false,
  id: null,
  source: OverflowSource.TRACKS,
  overflowActions: [],
  overflowActionCallbacks: {}
}

const actionsMap: ActionsMap<MobileOverflowModalState> = {
  [OPEN](state, action): MobileOverflowModalState {
    return {
      isOpen: true,
      id: action.id,
      source: action.source,
      overflowActions: action.overflowActions,
      overflowActionCallbacks: action.overflowActionCallbacks
    }
  },
  [CLOSE](state, action): MobileOverflowModalState {
    return initialState
  }
}

export default makeReducer(actionsMap, initialState)
