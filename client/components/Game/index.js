import { Component, PropTypes } from 'react'
import DocumentTitle from 'react-document-title'
import { shouldComponentUpdate } from 'react-addons-pure-render-mixin'
import style, {
  section as sectionClassName,
} from './style.scss'
import Navbar from './Navbar'
import VersusGrid from './VersusGrid'
import ViewerBoard from './ViewerBoard'
import { selectCell, fireCannon } from '../../actions'

class Game extends Component {
  static propTypes = {
    
  };
  
  shouldComponentUpdate = shouldComponentUpdate
  
  componentDidMount() {
    this.props.loadGame(this.props.routeParams.game)
  }
  
  handleFireCannon = event => {
    this.props.dispatch(fireCannon({ id: this.props.routeParams.game, selectedCell: this.props.selectedCell }))
  }
  
  render(){
    const {
      gameState,
      reasonFailed,
      versusFriend,
      viewer,
      versusGrid,
      viewerGrid,
      viewerBoard,
      selectedCell,
      turns,
      dispatch,
      isViewerTurn,
      viewerScore,
      versusScore,
    } = this.props
    
    return <DocumentTitle title={viewer ? `Epic | ${viewer.get('username')} vs. ${versusFriend && versusFriend.get('username')}` : null}>
      <section className={sectionClassName}>
        <Navbar viewer={viewer} versus={versusFriend} />
        <div className={style.scores}>
          <div className={style.score}>
            <h6 className={style.header}>{viewer && viewer.get('username') || 'You'}</h6>
            <strong className={style.viewerScore}>{viewerScore}</strong>
          </div>
          <div className={style.score}>
            <h6 className={style.header}>{versusFriend && versusFriend.get('username') || 'Versus'}</h6>
            <strong className={style.versusScore}>{versusScore}</strong>
          </div>
        </div>
        <div className={style.state}>
          {gameState === 'failed' && reasonFailed && <div>Error: {reasonFailed}</div>}
          {gameState === 'victory' && <div>You won!</div>}
          {gameState === 'defeated' && <div>You lost!</div>}
          {gameState === 'loading' && <div>Loading game…</div>}
          {isViewerTurn && gameState !== 'waiting' && gameState !== 'victory' && gameState !== 'defeat' && (selectedCell === -1 ? 'Select a spot' : <div className={style.readyToFire}>Ready? <button className={style.sendButton} onClick={this.handleFireCannon}>Send</button></div>)}
          {gameState === 'waiting' && gameState !== 'victory' && gameState !== 'defeat' && <div className={style.waitingForOpponent}>Waiting for {versusFriend && versusFriend.get('username') || 'opponent'} to setup their board</div>}
          {gameState === 'ready' && !isViewerTurn && <div className={style.waitingForTurn}>{versusFriend && versusFriend.get('username') || 'opponent'}'s turn</div>}
        </div>
        {gameState !== 'loading' && <VersusGrid gameState={gameState} gameId={this.props.routeParams.game} score={viewerScore} grid={versusGrid} turns={turns} selectedCell={selectedCell} dispatch={dispatch} isViewerTurn={isViewerTurn} versus={versusFriend} />}
        {gameState !== 'loading' && <ViewerBoard score={versusScore} grid={viewerGrid} board={viewerBoard} turns={turns} versus={versusFriend} isViewerTurn={isViewerTurn} />}
      </section>
    </DocumentTitle>
  }
}

export default Game