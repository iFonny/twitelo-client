import { setLanguage } from 'redux-i18n';

import api from './api';

import { fetchUpdatedUser } from '../actions/user';

export default async function logUser(store, req) {
  if (req.isAuthenticated()) {
    // Auth requests
    api.defaults.headers.common.Authorization = req.user.twitelo_token;

    await store.dispatch(fetchUpdatedUser());
    const { user } = store.getState();
    store.dispatch(setLanguage(user.settings.locale));
  }
}
