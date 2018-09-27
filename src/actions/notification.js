import api from '../libs/api';
import types from './actionTypes';
import { setError } from './base';

export function fetchUnarchivedNotifications() {
  return dispatch =>
    api
      .get(`/notification/me/unarchived/limit/100`)
      .then(response => response.data)
      .then(json =>
        dispatch({
          type: types.SET_NOTIFICATIONS,
          payload: json.data,
        }),
      )
      .catch(error => dispatch(setError(error)));
}
