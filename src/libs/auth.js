import api from './api';

import { setUser } from '../actions/user';
import { fetchNotifications } from '../actions/notification';

export default async function logUser(store, req) {
  if (req.isAuthenticated()) {
    // Auth requests
    api.defaults.headers.common.Authorization = req.user.twitelo_token;

    try {
      const user = (await api.get('/user/me/update')).data.data;

      store.dispatch(setUser(user));
      await store.dispatch(fetchNotifications());

      // TODO : CONTINUER INTEGRATION AUTH

      /* commit('user/SET_USER', user);
        await dispatch('notifications/fetchNotifications');
        commit('SET_LANG', {
          locale: user.settings.locale,
          status: false,
        });
        app.i18n.locale = user.settings.locale; */
    } catch (e) {
      /* dispatch('setError', e);
        error(state.error); */
    }
  }
}
