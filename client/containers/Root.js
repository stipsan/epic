import { Component, PropTypes } from 'react'
import { Provider, connect } from 'react-redux'
import { Router, Route, browserHistory, Link, IndexRoute } from 'react-router'
import { syncHistoryWithStore, replace } from 'react-router-redux'
import Index from './Index'
import Login from './Login'
import Lobby from '../components/Lobby'
import NotFound from '../components/NotFound'

function Foo() {
  return <section className="section section--foo">
    <h1>Foo</h1>
    <Link to="/">Home</Link>
  </section>
}

function Bar() {
  return <section className="section section--bar">
    <h1>Bar</h1>
    <Link to="/">Home</Link>
  </section>
}
function Dashboard() {
  return <section className="section section--dashboard">
    <h1>Dashboard</h1>
    <Link to="/">Home</Link>
  </section>
}

class App extends Component {
  componentWillMount () {
    if(this.props.connected) this.props.checkAuth(this.props.isAuthenticated, this.props.location.pathname);
  }

  componentWillReceiveProps (nextProps) {
    if(nextProps.connected) this.props.checkAuth(nextProps.isAuthenticated, nextProps.location.pathname);
  }
  
  render() {
    const { connected, disconnnected, supportedBrowser, children } = this.props
    return <div className="page">
      {connected && supportedBrowser && children}
      {!connected && supportedBrowser && <h1></h1>/*@TODO add loading indicator*/}
      {!supportedBrowser && <h1>Unsupported browser</h1>}
    </div>
  }
}
const AppContainer = connect(
  state => {
    return {
      connected: state.connected,
      disconnected: state.disconnected,
      supportedBrowser: state.capabilities.websocket,
      isAuthenticated: state.auth.isAuthenticated,
    }
  },
  dispatch => ({
    checkAuth: (isAuthenticated, pathname) => {
      if (!isAuthenticated && pathname !== '/login') {
          dispatch(replace({ pathname: '/login', state: { redirectAfterLogin: pathname } }));
      }
    }
  }),
)(App)

function onEnter(nextState, replace) {
  console.log('onEnter', this.constructor.name, nextState)
}
function onEnter1(nextState, replace) {
  console.log('onEnter1', this.constructor.name, nextState)
}
function onEnter2(nextState, replace) {
  console.log('onEnter2', this.constructor.name, nextState)
}

export default class Root extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
  }
  
  checkAuth = (nextState, replace) => {
    const { auth: { isAuthenticated } } = this.props.store.getState()
    const { location: { pathname } } = nextState
    
    console.log('checkAuth', nextState, isAuthenticated)
    
    if (!isAuthenticated && pathname !== '/login') {
      
      replace({
        pathname: '/login',
        state: { redirectAfterLogin: pathname }
      })
        //let redirectAfterLogin = this.props.location.pathname;
        //this.props
        //    .dispatch(pushState(null, `/login?next=${redirectAfterLogin}`));
    }
  }

  render() {
    const { store } = this.props
    const { checkAuth } = this
    
    // Create an enhanced history that syncs navigation events with the store
    const history = syncHistoryWithStore(browserHistory, store)
    
    return (
      <Provider store={store}>
        <Router history={history}>
          <Route path="/" component={AppContainer}>
            <IndexRoute component={Lobby} />
            <Route path="login" component={Login} />
            <Route path="*" component={NotFound}/>
          </Route>
        </Router>
      </Provider>
    )
  }
}