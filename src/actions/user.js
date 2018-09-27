import types from './actionTypes';
import api from '../libs/api';
import { setError } from './base';

export const setUser = user => ({
  type: types.SET_USER,
  payload: user,
});

export function fetchUpdatedUser() {
  return dispatch =>
    api
      .get(`/user/me/update`)
      .then(response => response.data)
      .then(json =>
        dispatch({
          type: types.SET_USER,
          payload: json.data,
        }),
      )
      .catch(error => dispatch(setError(error)));
}
