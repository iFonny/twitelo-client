import { setLanguage } from 'redux-i18n';

import api from './api';

import { fetchUpdatedUser } from '../actions/user';
import { fetchUnarchivedNotifications } from '../actions/notification';

export default async function logUser(store, req) {
  if (req.isAuthenticated()) {
    // Auth requests
    api.defaults.headers.common.Authorization = req.user.twitelo_token;

    await store.dispatch(fetchUpdatedUser());
    const { user } = store.getState();
    await store.dispatch(fetchUnarchivedNotifications());
    store.dispatch(setLanguage(user.settings.locale));
  }
}
