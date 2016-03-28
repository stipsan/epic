import { connect } from 'react-redux'
import {
  loadGame,
  resumeGame,
  pickSpot,
  checkSpot,
  fetchFriends,
 } from '../actions'

import Game from '../components/Game'

const mapStateToProps = (state, ownProps) => {
  const versusFriendId = state.getIn(['game', 'versus'])
  return ({
  gameState: state.getIn(['game', 'gameState']),
  reasonFailed: state.getIn(['game', 'reasonFailed']),
  versusFriend: state.getIn(['friends', 'list', versusFriendId]),
  viewer: state.get('viewer'),
  isViewerTurn: state.getIn(['game', 'isViewerTurn']),
  versusGrid: state.getIn(['game', 'versusGrid']),
})
}

const mapDispatchToProps = dispatch => ({
  resumeGame: id => {
    dispatch(resumeGame(id))
  },
  loadGame: id => {
    dispatch(loadGame(id))
    // @TODO temp measure this is 
    dispatch(fetchFriends())
  },
  pickSpot: position => {
    dispatch(pickSpot(position))
  },
})

// move this to grandchildren so the root don't need to subscribe to Redux
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game)