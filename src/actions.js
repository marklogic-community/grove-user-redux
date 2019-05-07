import * as types from './actionTypes';
import defaultAPI from './api';

export const completeLogin = user => ({
  type: types.NETWORK_LOGIN_SUCCESS,
  payload: { user }
});

export const setCurrentUser = username => ({
  type: types.SET_CURRENT_USER,
  payload: { username }
});

export const submitLogin = (username, password, extraArgs = {}) => {
  const API = extraArgs.api || defaultAPI;
  return dispatch => {
    dispatch({
      type: types.NETWORK_LOGIN_PENDING,
      payload: { username }
    });
    return API.login(username, password)
      .then(response => {
        if (response.ok) {
          dispatch(setCurrentUser(username));
          dispatch(completeLogin({ username }));
        }
      })
      .catch(error => {
        dispatch({
          type: types.NETWORK_LOGIN_ERROR,
          payload: {
            error,
            username
          }
        });
      });
  };
};

export const completeNetworkLogout = username => ({
  type: types.NETWORK_LOGOUT_SUCCESS,
  payload: { username }
});

export const submitLogout = (username, extraArgs = {}) => {
  const API = extraArgs.api || defaultAPI;
  return dispatch => {
    dispatch(localLogout());
    dispatch({
      type: types.NETWORK_LOGOUT_PENDING,
      payload: { username }
    });
    return API.logout(username)
      .then(response => {
        if (response.ok) {
          dispatch(completeNetworkLogout(username));
        }
      })
      .catch(error => {
        dispatch({
          type: types.NETWORK_LOGOUT_ERROR,
          payload: {
            error,
            username
          }
        });
      });
  };
};

export const localLogout = () => ({
  type: types.LOCAL_LOGOUT
});

export const getAuthenticationStatus = (extraArgs = {}) => {
  const API = extraArgs.api || defaultAPI;
  return dispatch => {
    dispatch({
      type: types.FETCH_AUTHSTATUS_PENDING,
      payload: { username }
    });
    return API.status()
      .then(response => {
        dispatch({
          type: types.FETCH_AUTHSTATUS_SUCCESS,
          payload: { user: response }
        });
      })
      .catch(error => {
        dispatch({
          type: types.FETCH_AUTHSTATUS_ERROR,
          payload: {
            error,
            username
          }
        });
      });
  };
};
