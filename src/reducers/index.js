import { combineReducers } from 'redux';

import { i18nState } from 'redux-i18n';

import base from './base';
import user from './user';
import notifications from './notification';

export default combineReducers({
  i18nState,
  base,
  user,
  notifications,
});
