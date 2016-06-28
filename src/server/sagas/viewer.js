import { emit } from 'redux-saga-sc'
import { fork, call, take } from 'redux-saga/effects'

import {
  VIEWER_REQUESTED,
  VIEWER_SUCCESS,
  VIEWER_FAILURE,
} from '../constants/ActionTypes'

export function *getViewer(socket, database, redis) {
  try {
    const payload = yield call(database.getViewer, socket.getAuthToken(), redis)
    console.log('viewer', payload, socket.getAuthToken())
    yield call(emit, socket, { type: VIEWER_SUCCESS, payload })
  } catch (error) {
    yield call(emit, socket, { type: VIEWER_FAILURE, payload: {
      error: error.message
    } })
  }
}

export function *watchViewerLoggedIn(socket, database, redis) {
  while (true) { // eslint-disable-line no-constant-condition
    yield take(VIEWER_REQUESTED)
    yield fork(getViewer, socket, database, redis)
  }
}
