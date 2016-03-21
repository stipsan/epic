import {
  LOGIN_SUCCESS,
  GAME_INVITE_SUCCESS,
  ACCEPT_GAME_INVITE_SUCCESS,
  RECEIVE_GAME_INVITE_DECLINED,
  CANCEL_GAME_INVITE_SUCCESS,
} from '../constants/ActionTypes'
import { Set as ImmutableSet } from 'immutable'

const initialState = ImmutableSet()

export const requests = (state = initialState, action) => {
  switch (action.type) {
  case LOGIN_SUCCESS:
    return state.intersect(action.requests)
  case GAME_INVITE_SUCCESS:
  case ACCEPT_GAME_INVITE_SUCCESS:
    return state.add(action.username)
  case RECEIVE_GAME_INVITE_DECLINED:
  case CANCEL_GAME_INVITE_SUCCESS:
    return state.subtract(action.username)
  default:
    return state
  }
}