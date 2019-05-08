import * as types from '../actionTypes';
export default (state = { isAuthStatusKnown: false }, action) => {
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
        currentUser: action.payload.user.username,
        isAuthStatusKnown: true,
        isAuthStatusPending: false
      };
      username = action.payload.user.username || state.currentUser;
      if (username) {
        newState[username] = {
          ...state[username],
          isAuthenticated: action.payload.user.authenticated
        };
      }
      return newState;
    }
    case types.FETCH_AUTHSTATUS_ERROR: {
      const newState = {
        ...state,
        isAuthStatusPending: false
      };
      return newState;
    }
    case types.FETCH_AUTHSTATUS_PENDING: {
      const newState = {
        ...state,
        isAuthStatusPending: true
      };
      return newState;
    }
    default:
      return state;
  }
};

const currentUser = state => state.currentUser;
const isAuthenticated = (state, user) =>
  state[user] && state[user].isAuthenticated;
const isLoginPending = state => {
  const user = currentUser(state);
  return state[user] && state[user].isLoginPending;
};
const isLogoutPending = state => {
  const user = currentUser(state);
  return state[user] && state[user].isLogoutPending;
};
const isAuthStatusPending = state => {
  // return state.isAuthStatusPending;
  return typeof state.isAuthStatusPending === 'boolean'
    ? state.isAuthStatusPending
    : true;
};

const selectors = {
  isAuthenticated,
  isLoginPending,
  isLogoutPending,
  isAuthStatusPending,
  isAuthStatusKnown: state => state.isAuthStatusKnown,
  isCurrentUserAuthenticated: state => {
    const user = currentUser(state);
    return !!user && isAuthenticated(state, user);
  },
  currentUser
};

export { selectors };
