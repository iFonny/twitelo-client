import { combineReducers } from 'redux';

import { i18nState } from 'redux-i18n';

import base from './base';
import user from './user';
import builder from './builder';

export default combineReducers({
  i18nState,
  base,
  user,
  builder,
});
