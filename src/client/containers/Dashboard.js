import { connect } from 'react-redux'

import Dashboard from '../components/Dashboard'
import { fetchFriends } from '../actions'

const mapStateToProps = state => ({
  username: state.getIn(['viewer', 'username'])
})

const mapDispatchToProps = dispatch => ({
  dispatch
})

// move this to grandchildren so the root don't need to subscribe to Redux
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)
