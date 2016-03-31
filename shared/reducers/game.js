import {
  NEW_GAME_REQUEST,
  LOAD_GAME_REQUEST,
  LOAD_GAME_SUCCESS,
  LOAD_GAME_FAILURE,
  NEW_GAME_SUCCESS,
  RECEIVE_GAME,
  LOAD_ITEMS,
  PLACE_CROSSHAIRS,
  RECEIVE_HIT,
  RECEIVE_MISS,
  FIRE_CANNON_REQUEST,
  FIRE_CANNON_SUCCESS,
  JOIN_GAME_SUCCESS,
} from '../constants/ActionTypes'
import { fromJS } from 'immutable'
import { board } from './board'

const initialState = fromJS({
  id: null,
  versus: null,
  versusGrid: [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  ],
  viewerGrid: [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  ],
  viewerBoard: board(undefined, {}),
  turns: [],
  isViewerFirst: null,
  isViewerTurn: false,
  gameState: 'standby', // loading | failed | setup | waiting | ready | victory | defeat
  reasonFailed: null,
  selectedCell: -1,
  viewerScore: 0,
  versusScore: 0,
})

export const game = (state = initialState, action) => {
  switch (action.type) {
  case NEW_GAME_REQUEST:
    return initialState.set('gameState', 'setup')
  case NEW_GAME_SUCCESS:
    return state
      .set('id', action.id)
      .set('gameState', 'waiting')
  case JOIN_GAME_SUCCESS:
    return initialState
      .set('id', action.id)
      .set('gameState', 'ready')
  case LOAD_GAME_REQUEST:
    return initialState
      .set('id', action.id)
      .set('gameState', 'loading')
  case LOAD_GAME_FAILURE:
    return state
      .set('gameState', 'failed')
      .set('reasonFailed', action.error.message)
  case LOAD_GAME_SUCCESS:
    return state
      .merge({
        id: action.id,
        versus: action.versus,
        viewerBoard: board(undefined, {
          type: LOAD_ITEMS, 
          board: {
            grid: action.viewerBoard
          }
        }),
        turns: action.turns || [],
        gameState: action.gameState,
        isViewerFirst: action.isViewerFirst,
        isViewerTurn: action.isViewerFirst,
        viewerScore: action.viewerScore,
        versusScore: action.versusScore,
      })
      .update(state => {
        console.log('state', state.get('turns'))
        return state.get('turns').reduce((previousState, turn) => {
          // Versus opponent moves
          if(turn.get('id') === state.get('versus')) {
            if(turn.get('hit') === true) {
              return previousState
                .set('isViewerTurn', false)
                .setIn(['viewerGrid', turn.get('index')], Number(turn.get('hit')))
            } else {
              return previousState
                .set('isViewerTurn', true)
                .setIn(['viewerGrid', turn.get('index')], Number(turn.get('hit')))
            }
          // Viewer moves
          } else {
            if(turn.get('hit') === true) {
              return previousState
                .set('isViewerTurn', true)
                .setIn(['versusGrid', turn.get('index')], Number(turn.get('hit')))
            } else {
              return previousState
                .set('isViewerTurn', false)
                .setIn(['versusGrid', turn.get('index')], Number(turn.get('hit')))
            }
          }          
        }, state)
      })
  case PLACE_CROSSHAIRS:
    return state.set('selectedCell', action.selectedCell)
  case RECEIVE_MISS:
    return state
      .set('isViewerTurn', true)
      .updateIn(['turns'], update => update.push(fromJS(action.turn)))
      .setIn(['viewerGrid', action.turn.index], Number(action.turn.hit))
  case RECEIVE_HIT:
    return state
      .set('isViewerTurn', false)
      .updateIn(['turns'], update => update.push(fromJS(action.turn)))
      .setIn(['viewerGrid', action.turn.index], Number(action.turn.hit))
      .set('versusScore', action.versusScore)
      .set('gameState', versusScore === 21 ? 'defeated' : state.get('gameState'))
  case FIRE_CANNON_SUCCESS:    
    return state
      .set('isViewerTurn', action.isViewerTurn)
      .updateIn(['turns'], update => update.push(fromJS(action.turn)))
      .setIn(['versusGrid', action.turn.index], Number(action.turn.hit))
      .set('viewerScore', action.viewerScore)
      .set('gameState', viewerScore === 21 ? 'victory' : state.get('gameState'))
  case FIRE_CANNON_REQUEST:
    return state.set('selectedCell', -1)
  default:
    return state
  }
}