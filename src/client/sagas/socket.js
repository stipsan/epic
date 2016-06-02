import { startSubmit, stopSubmit } from 'redux-form'
import { delay, eventChannel } from 'redux-saga'
import { take, fork, call, put, race, cps, actionChannel, cancelled } from 'redux-saga/effects'

import {
  SOCKET_EMIT,
  SOCKET_PONG_TIMEOUT,
} from '../constants/ActionTypes'
import { socket } from '../services'

export function handleSocketEvent(event) {
  console.log('socket is listening to:', event)
  return eventChannel(listener => {
    const handleClientRequest = (action, cb) => {
      // notify the client that the request is received
      cb() // eslint-disable-line
      console.log('handleSocketEvent:', event, action)
      listener(action)
    }
    socket.on(event, handleClientRequest)
    return () => {
      console.log('socket stopped listening to:', event)
      socket.off(event, handleClientRequest)
    }
  })
}

export function *watchServerRequests() {
  const chan = yield call(handleSocketEvent, 'request')
  try {
    while (true) { // eslint-disable-line
      const action = yield take(chan)
      console.log('watchServerRequests:', action)
      yield put(action)
    }
  } finally {
    if (yield cancelled()) {
        // @FIXME put in an action creator
      yield put({
        type: 'UNEXPECTED_ERROR',
        payload: {
          message: 'watchServerRequests saga got cancelled!'
        }
      })
    }
  }
}


// @FIXME client and server can likely share a lot of code in the socket sagas
export function *emitEvent(action) {
  try {
    console.log('emit')
    yield cps([socket, socket.emit], 'request', action)
    console.log('emitttt')
  } catch (error) {
    if ('TimeoutError' === error.name) {
      yield put({ type: SOCKET_PONG_TIMEOUT, payload: { error } })
    } else {
      yield put({ type: action.payload.failureType, payload: { error } })
    }
  }
}

// @TODO move start/stopSubmit calls to a worker that is woke up by CHECK_EMAIL_EXISTS_REQUESTED
export function *handleEmit(action) {
  const { successType, failureType } = action.payload

  yield put(startSubmit('login'))

  let retries = 0

  while (3 > retries++) {
    yield fork(emitEvent, action)

    const { response } = yield race({
      response: take([successType, failureType]),
      pongTimeout: take(SOCKET_PONG_TIMEOUT),
      taskTimeout: call(delay, 10000),
    })

    if (response) {
      retries = 3
    }
  }
  yield put(stopSubmit('login'))
}

export function *watchSocketEmits() {
  console.log('1- Create a channel for request actions', SOCKET_EMIT)
  const requestChan = yield actionChannel(SOCKET_EMIT)
  while (true) { // eslint-disable-line
    const { payload } = yield take(requestChan)
    yield call(handleEmit, payload)
  }
}

// function* handleRequest(payload) { ... }
