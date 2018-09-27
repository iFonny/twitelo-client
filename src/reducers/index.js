import { combineReducers } from 'redux';

import base from './base';
import user from './user';
import notifications from './notification';

export default combineReducers({
  base,
  user,
  notifications,
});
