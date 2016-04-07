import { Component, PropTypes } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { shouldComponentUpdate } from 'react-addons-pure-render-mixin'
import DocumentTitle from 'react-document-title'
import { Link } from 'react-router'
import cx from './style.scss'
import Friend from './Friend'

class NewGame extends Component {
  static propTypes = {
    friends: ImmutablePropTypes.orderedMap.isRequired,
    friendsTotal: PropTypes.number.isRequired,
  }
  
  shouldComponentUpdate = shouldComponentUpdate
  
  componentDidMount() {
    const { friends, friendsTotal, fetchFriends } = this.props

    if(friends.size !== friendsTotal) {
      fetchFriends()
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if(nextProps.friendsTotal !== this.props.friendsTotal) {
      nextProps.fetchFriends()
    }
  }
  
  render() {
    const {
      friends,
      friendsTotal,
      bots,
    } = this.props
    
    const friendsOnline = friends.filter(friend => friend.get('online') === '1')
    const friendsOnlineTotal = friendsOnline.size
    const friendsOffline = friends.filter(friend => friend.get('online') !== '1')
    const friendsOfflineTotal = friendsOffline.size

    return <DocumentTitle title="Epic | New game">
      <section>
        <header className={cx('header')}>
          <div className={cx('headerLeft')}>
            <Link to="/" className={cx('linkToPrevous')}>❮ Back</Link>
          </div>
          <div className={cx('headerCenter')}>
            <h1 className={cx('headerTitle')}>Select your opponent</h1>
          </div>
          <div className={cx('headerRight')}>
            <span className={cx('headerMenu')}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
        </header>
        <div className={cx('container')}>
          <h4 className={cx('heading')}>Bots</h4>
          {bots.toArray().map(bot => <Friend key={bot.get('id')} friend={bot} />)}
        </div>
        {friendsOnlineTotal > 0 && <div className={cx('container')}>
          <h4 className={cx('heading')}>Online</h4>
          {friendsOnline.toArray().map(friend => <Friend key={friend.get('id')} friend={friend} />)}
        </div>}
        {friendsOfflineTotal > 0 && <div className={cx('container')}>
          <h4 className={cx('heading')}>Friends</h4>
          {friendsOffline.toArray().map(friend => <Friend key={friend.get('id')} friend={friend} />)}
        </div>}
      </section>
    </DocumentTitle>
  }
}

export default NewGame