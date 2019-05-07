import * as types from '../actionTypes';
export default (state = {}, action) => {
  let username;
  switch (action.type) {
    case types.NETWORK_LOGIN_SUCCESS:
      username = action.payload.user.username;
      return {
        ...state,
        [username]: {
          ...state[username],
          isLoginPending: false,
          isAuthenticated: true
        }
      };
    case types.NETWORK_LOGIN_ERROR:
      username = action.payload.username;
      return {
        ...state,
        [username]: {
          ...state[username],
          isLoginPending: false
        }
      };
    case types.NETWORK_LOGIN_PENDING:
      username = action.payload.username;
      return {
        ...state,
        isLoginPending: true,
        [username]: {
          ...state[username],
          isLoginPending: true
        }
      };
    case types.NETWORK_LOGOUT_SUCCESS:
      return {
        ...state,
        [action.payload.username]: {
          ...state[action.payload.username],
          isLogoutPending: false,
          isAuthenticated: false
        }
      };
    case types.NETWORK_LOGOUT_ERROR:
      return {
        ...state,
        [action.payload.username]: {
          ...state[action.payload.username],
          isLogoutPending: false
        }
      };
    case types.NETWORK_LOGOUT_PENDING:
      return {
        ...state,
        [action.payload.username]: {
          ...state[action.payload.username],
          isLogoutPending: true
        }
      };
    case types.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload.username
      };
    case types.LOCAL_LOGOUT: {
      let stateClone = Object.assign({}, state);
      delete stateClone.currentUser;
      return stateClone;
    }
    case types.FETCH_AUTHSTATUS_SUCCESS: {
      const newState = {
        ...state,
        currentUser: action.payload.user.username
      };
      username = action.payload.user.username || state.currentUser;
      if (username) {
        newState[username] = {
          ...state[username],
          isAuthStatusPending: false,
          isAuthenticated: action.payload.user.authenticated
        };
      }
      return newState;
    }
    case types.FETCH_AUTHSTATUS_ERROR: {
      const newState = {
        ...state,
        currentUser: action.payload.username
      };
      username = action.payload.username || state.currentUser;
      if (username) {
        newState[username] = {
          ...state[username],
          isAuthStatusPending: false
        };
      }
      return newState;
    }
    case types.FETCH_AUTHSTATUS_PENDING: {
      const newState = {
        ...state,
        currentUser: action.payload.username
      };
      username = action.payload.username || state.currentUser;
      if (username) {
        newState[username] = {
          ...state[username],
          isAuthStatusPending: true
        };
      }
      return newState;
    }
    default:
      return state;
  }
};

const currentUser = state => state.currentUser;
const isAuthenticated = (state, user) =>
  state[user] && state[user].isAuthenticated;

const selectors = {
  isAuthenticated: (state, user) => state[user] && state[user].isAuthenticated,
  isCurrentUserAuthenticated: state => {
    const user = currentUser(state);
    return !!user && isAuthenticated(state, user);
  },
  currentUser
};

export { selectors };
