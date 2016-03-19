import * as TYPE from '../constants/ActionTypes'
export * from './auth'
export * from './socket'
export * from './user'
export * from './game_invite'
export * from './game_play'

export const receiveFriend = friend => {
  return { type: TYPE.RECEIVE_FRIEND, friend }
}

export const inviteFriend = username => {
  return { type: TYPE.GAME_INVITE_SUCCESS, username }
}
export const acceptInvite = username => {
  return { type: TYPE.ACCEPT_GAME_INVITE_SUCCESS, username }
}
export const declineInvite = username => {
  return { type: TYPE.DECLINE_GAME_INVITE_SUCCESS, username }
}