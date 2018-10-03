import _ from 'lodash';

import types from './actionTypes';
import api from '../libs/api';
import { setError } from './base';

export function fetchBuilderData() {
  return async dispatch => {
    try {
      let games = (await api.get('/game')).data.data;
      games = _.keyBy(games, 'id');
      const userTags = (await api.get(`/tag/me/all`)).data.data;
      const accountSettings = (await api.get('/game/settings/all')).data.data;
      let allAccounts = (await api.get('/account/me/all')).data.data;
      allAccounts = _.keyBy(allAccounts, 'id');

      /*
      for (const key of userTags) {
        userTags[key].included = false;
      } 
      */

      // TODO: CHECK SI FONCTIONNE VRAIMENT
      Object.keys(userTags).forEach(key => {
        userTags[key].included = false;
      });

      dispatch({
        type: types.SET_GAMES,
        payload: games,
      });
      dispatch({
        type: types.SET_USER_TAGS,
        payload: userTags,
      });
      dispatch({
        type: types.SET_ACCOUNT_SETTINGS,
        payload: accountSettings,
      });
      return dispatch({
        type: types.SET_ALL_ACCOUNTS,
        payload: allAccounts,
      });
    } catch (error) {
      return dispatch(setError(error));
    }
  };
}

export function transformFromUUID(twiteloUser, builder) {
  return async dispatch => {
    try {
      const replaceFromUUID = (text, userTags) => {
        let newText = text;
        const mapObj = {};
        const myRegexp = /<{([^<>{} ]+?)}>/g;
        let match = myRegexp.exec(newText);

        while (match != null) {
          const foundTag = _.findIndex(userTags, ['id', match[1]]);
          if (foundTag >= 0) {
            dispatch({
              type: types.SET_USER_TAG_INCLUDED,
              payload: foundTag,
            });
            mapObj[`<{${userTags[foundTag].id}}>`] = `<{${foundTag}}>`;
          }
          match = myRegexp.exec(newText);
        }

        if (Object.keys(mapObj).length > 0) {
          const re = new RegExp(
            Object.keys(mapObj)
              .join('|')
              .replace(/{/g, '\\{'),
            'g',
          );
          newText = newText.replace(re, matched => mapObj[matched]);
        }

        return newText;
      };

      Object.keys(builder.userTags).forEach(key => {
        dispatch({
          type: types.SET_USER_TAG_NOT_INCLUDED,
          payload: key,
        });
      });

      const transformed = {
        name: replaceFromUUID(
          twiteloUser.name.content.trim(),
          builder.userTags,
        ),
        description: replaceFromUUID(
          twiteloUser.description.content.trim(),
          builder.userTags,
        ),
        location: replaceFromUUID(
          twiteloUser.location.content.trim(),
          builder.userTags,
        ),
      };
      console.log('(all) transform <{12a65b}> -> <{1}>');
      return dispatch({
        type: types.SET_TWITELO_DATA_INPUT_ALL,
        payload: transformed,
      });
    } catch (error) {
      return dispatch(setError(error));
    }
  };
}
