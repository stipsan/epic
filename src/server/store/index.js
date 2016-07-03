import * as reducers from '../reducers'

import createSagaMiddleware from 'redux-saga'
import devTools from 'remote-redux-devtools'
import { Map as ImmutableMap } from 'immutable'
import { createStore, applyMiddleware, compose } from 'redux'
import { combineReducers } from 'redux-immutable'

import sagas from '../sagas'

export default (socket, database, redis) => {
  const sagaMiddleware = createSagaMiddleware()
  const middleware = applyMiddleware(sagaMiddleware)
  const enhancer = 'production' === process.env.NODE_ENV ?
    middleware : compose(middleware, devTools({ realtime: true }))
  const store = createStore(
    combineReducers(reducers),
    ImmutableMap(),
    enhancer
  )

  sagaMiddleware.run(sagas, socket, database, redis, store.getState)

  return store
}
