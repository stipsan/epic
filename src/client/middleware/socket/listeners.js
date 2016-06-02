import {
  SOCKET_FAILURE,
  SOCKET_ERROR,
  SUBSCRIBE_CHANNEL_REQUESTED,
  SUBSCRIBE_CHANNEL_SUCCESS,
  SUBSCRIBE_CHANNEL_FAILURE,
  RECEIVE_SUBSCRIBE_STATE_CHANGE,
  RECEIVE_UNSUBSCRIBE_CHANNEL,
  RECEIVE_KICK_OUT,
  RECEIVE_AUTH_STATE_CHANGE,
  RECEIVE_AUTHENTICATE,
  RECEIVE_DEAUTHENTICATE,
  SOCKET_DISCONNECT,
  LOGOUT_SUCCESS,
} from '../../constants/ActionTypes'

let shouldAttachListeners = true
export const attachListeners = (store, next, action, socket) => {
  if (!shouldAttachListeners) {
    return false
  }

  // connect.js
  socket.on('disconnect', () => {
    next({ type: SOCKET_DISCONNECT, socket })
  })
  socket.on('error', data => {
    next({ type: SOCKET_ERROR, event: 'error', ...data, socket })
  })
  socket.on('connectAbort', () => {
    next({ type: SOCKET_FAILURE, event: 'connectAbort', socket })
  })

  // authenticate.js
  socket.on('authenticate', (...args) => {
    next({ ...args, type: RECEIVE_AUTHENTICATE, socket })
  })
  socket.on('deauthenticate', (...args) => {
    next({ ...args, type: RECEIVE_DEAUTHENTICATE, socket })
  })
  socket.on('authStateChange', data => {
    if ('unauthenticated' === data.newState) {
      return next({ type: LOGOUT_SUCCESS, socket })
    }
    return next({ ...data, type: RECEIVE_AUTH_STATE_CHANGE, socket })
  })

  // channel.js
  socket.on('kickOut', (...args) => {
    next({ ...args, type: RECEIVE_KICK_OUT, socket })
  })
  socket.on('subscribe', channel => {
    next({ type: SUBSCRIBE_CHANNEL_SUCCESS, channel, socket })
  })
  socket.on('subscribeFail', (err, channel) => {
    next({ type: SUBSCRIBE_CHANNEL_FAILURE, error: err, channel, socket })
  })
  socket.on('unsubscribe', (...args) => {
    next({ ...args, type: RECEIVE_UNSUBSCRIBE_CHANNEL, socket })
  })
  socket.on('subscribeStateChange', (...args) => {
    next({ ...args, type: RECEIVE_SUBSCRIBE_STATE_CHANGE, socket })
  })
  socket.on('subscribeRequest', channel => {
    next({ type: SUBSCRIBE_CHANNEL_REQUESTED, channel, socket })
  })

  shouldAttachListeners = false

  return true
}

export const didAttachListeners = () => !shouldAttachListeners

// @TODO
export const removeAttachedListeners = () => {}
