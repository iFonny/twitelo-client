import { setLanguage } from 'redux-i18n';

import types from './actionTypes';
import api from '../libs/api';
import setError from './base';

export function setUserSwitch(mySwitch) {
  return dispatch =>
    api
      .post(`/setting/me/switch/global/${+mySwitch}`)
      .then(() =>
        dispatch({
          type: types.SET_USER_SWITCH,
          payload: mySwitch,
        }),
      )
      .catch(error => dispatch(setError(error)));
}

export function setUserTwiteloSwitch(name, status) {
  return dispatch =>
    api
      .post(`/setting/me/switch/twitelo/${name}/${+status}`)
      .then(() =>
        dispatch({
          type: types.SET_USER_TWITELO_SWITCH,
          payload: { name, status },
        }),
      )
      .catch(error => dispatch(setError(error)));
}

export function setUserLang(locale) {
  return dispatch => {
    dispatch(setLanguage(locale));
    return api
      .post(`/setting/me/user/locale/${locale}`)
      .then(() =>
        dispatch({
          type: types.SET_USER_LANG,
          payload: locale,
        }),
      )
      .catch(error => dispatch(setError(error)));
  };
}

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
