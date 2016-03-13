import { CALL_SOCKET } from '../middleware/socket'
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
} from '../constants/ActionTypes'
import {
  loginRequest,
} from '../socket'

// Fetches a single user from Github API.
// Relies on the custom API middleware defined in ../middleware/api.js.
function fetchUser(login) {
  return {
    [CALL_API]: {
      types: [ USER_REQUEST, USER_SUCCESS, USER_FAILURE ],
      endpoint: `users/${login}`,
      schema: Schemas.USER
    }
  }
}

// Fetches a single user from Github API unless it is cached.
// Relies on Redux Thunk middleware.
export function loadUser(login, requiredFields = []) {
  return (dispatch, getState) => {
    const user = getState().entities.users[login]
    if (user && requiredFields.every(key => user.hasOwnProperty(key))) {
      return null
    }

    return dispatch(fetchUser(login))
  }
}

/*
export const login = username => {
  return dispatch => {
    dispatch({ type: LOGIN_REQUEST })
    loginRequest(
      username,
      data => {
        const { viewer, friends } = data
        dispatch({
          type: LOGIN_SUCCESS,
          friends,
          ...viewer
        })
      },
      message => dispatch({ type: LOGIN_FAILURE, message })
    );
  }
}
//*/