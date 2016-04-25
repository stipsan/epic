import { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import cx from './style.scss'
import GameRow from './GameRow'

class Games extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
  }

  componentDidMount() {
    const { games, gamesTotal, fetchGames, friends, friendsTotal, fetchFriends } = this.props

    if (friends.size !== friendsTotal) {
      fetchFriends()
    }

    // @FIXME poor mans push sync
    // if(games.size !== gamesTotal) {
    fetchGames()
    // }
  }

  render() {
    const { children, games, gamesTotal, friends, friendsTotal, bots } = this.props

    if (!friends) return <h1>Loading…</h1>

    return (<div className={cx('gamesList')}>
      <Link to="/new" className={cx('game')}>
        <span className={cx('newGame')}>
          +
        </span>
        <span className={cx('username')}>New Game</span>
        <span className={cx('startGame')}>❯</span>
      </Link>
      {gamesTotal > 0 && games.toArray().reverse().map(game => <GameRow key={game.get('id')} friendsTotal={friendsTotal} friends={friends} game={game} bots={bots} />)}
    </div>)
  }
}

export default Games
