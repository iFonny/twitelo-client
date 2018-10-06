import _ from 'lodash';

import types from './actionTypes';
import api from '../libs/api';
import { setError } from './base';

export function setTwiteloDataInput(name, value) {
  return {
    type: types.SET_TWITELO_DATA_INPUT,
    payload: { name, value },
  };
}

export function setPreviewData(name, value) {
  return {
    type: types.SET_PREVIEW_DATA,
    payload: { name, value },
  };
}

export function updateAccount(account) {
  return {
    type: types.UPDATE_ACCOUNT,
    payload: account,
  };
}

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

export function selectAndFetchTags(game) {
  return async dispatch => {
    try {
      dispatch({
        type: types.SET_SELECTED_GAME,
        payload: game,
      });

      if (game) {
        let tags = (await api.get(`/game/tags/game/${game.id}`)).data.data;
        tags = _.groupBy(tags, 'category');
        const pages = _.chunk(Object.keys(tags), 4);

        dispatch({
          type: types.SET_GAME_TAGS_CATEGORY,
          payload: tags,
        });
        return dispatch({
          type: types.SET_GAME_TAGS_CATEGORY_PAGES,
          payload: pages,
        });
      }

      dispatch({
        type: types.SET_GAME_TAGS_CATEGORY,
        payload: null,
      });
      return dispatch({
        type: types.SET_GAME_TAGS_CATEGORY_PAGES,
        payload: [],
      });
    } catch (error) {
      return dispatch(setError(error));
    }
  };
}

export function updateTextCounters(builder, name) {
  return dispatch => {
    try {
      const getTextLength = text => {
        let newText = text;
        let counter = 0;
        const removeArray = [];
        const myRegexp = /<{([^<>{} ]+?)}>/g;
        let match = myRegexp.exec(newText);

        while (match != null) {
          if (builder.userTags[match[1]]) counter += builder.userTags[match[1]].size;
          removeArray.push(`<{${match[1]}}>`);
          match = myRegexp.exec(newText);
        }

        if (removeArray.length > 0) {
          const re = new RegExp(removeArray.join('|').replace(/{/g, '\\{'), 'g');
          newText = newText.replace(re, '');
        }

        newText = newText.trim();
        return newText.length + counter;
      };

      if (name) {
        return dispatch({
          type: types.SET_TEXT_COUNTER,
          payload: {
            name,
            value: builder.twitterLimits[name] - getTextLength(builder.twiteloDataInput[name]),
          },
        });
      }

      dispatch({
        type: types.SET_TEXT_COUNTER,
        payload: {
          name: 'name',
          value: builder.twitterLimits.name - getTextLength(builder.twiteloDataInput.name),
        },
      });
      dispatch({
        type: types.SET_TEXT_COUNTER,
        payload: {
          name: 'description',
          value:
            builder.twitterLimits.description - getTextLength(builder.twiteloDataInput.description),
        },
      });
      return dispatch({
        type: types.SET_TEXT_COUNTER,
        payload: {
          name: 'location',
          value: builder.twitterLimits.location - getTextLength(builder.twiteloDataInput.location),
        },
      });
    } catch (error) {
      return dispatch(setError(error));
    }
  };
}

export function transformFromUUID(twiteloUser, builder) {
  return dispatch => {
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
        name: replaceFromUUID(twiteloUser.name.content.trim(), builder.userTags),
        description: replaceFromUUID(twiteloUser.description.content.trim(), builder.userTags),
        location: replaceFromUUID(twiteloUser.location.content.trim(), builder.userTags),
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

export function transformToUUID(twiteloUser, builder) {
  return dispatch => {
    try {
      const replaceToUUID = (text, userTags) => {
        let newText = text;
        const mapObj = {};
        const myRegexp = /<{([^<>{} ]+?)}>/g;
        let match = myRegexp.exec(newText);

        while (match != null) {
          if (userTags[match[1]]) {
            dispatch({
              type: types.SET_USER_TAG_INCLUDED,
              payload: match[1],
            });
            mapObj[`<{${match[1]}}>`] = `<{${userTags[match[1]].id}}>`;
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

      const transformed = _.cloneDeep(twiteloUser);

      transformed.name.content = replaceToUUID(
        builder.twiteloDataInput.name.trim(),
        builder.userTags,
      );
      transformed.description.content = replaceToUUID(
        builder.twiteloDataInput.description.trim(),
        builder.userTags,
      );
      transformed.location.content = replaceToUUID(
        builder.twiteloDataInput.location.trim(),
        builder.userTags,
      );

      dispatch({
        type: types.SET_TWITELO_DATA,
        payload: transformed,
      });
      console.log('(all) transform <{1}> -> <{12a65b}>');

      // Preview need update
      return dispatch({
        type: types.SET_PREVIEW_DATA,
        payload: {
          name: 'needUpdate',
          value: true,
        },
      });
    } catch (error) {
      return dispatch(setError(error));
    }
  };
}

export function refreshPreview(twiteloUser, builder) {
  return async dispatch => {
    try {
      // Start loadings
      dispatch({
        type: types.SET_PREVIEW_DATA,
        payload: {
          name: 'loading',
          value: true,
        },
      });
      dispatch({
        type: types.SET_BUILDER_LOADING,
        payload: true,
      });

      await dispatch(transformToUUID(twiteloUser, builder));

      const preview = (await api.post(`/user/me/preview`, {
        name: twiteloUser.name.content,
        description: twiteloUser.description.content,
        location: twiteloUser.location.content,
      })).data.data;

      // Update preview text
      dispatch({
        type: types.SET_PREVIEW_PROFILE,
        payload: preview,
      });

      // Stop loadings
      dispatch({
        type: types.SET_PREVIEW_DATA,
        payload: {
          name: 'loading',
          value: false,
        },
      });
      dispatch({
        type: types.SET_PREVIEW_DATA,
        payload: {
          name: 'needUpdate',
          value: false,
        },
      });
      return dispatch({
        type: types.SET_BUILDER_LOADING,
        payload: false,
      });
    } catch (error) {
      return dispatch(setError(error));
    }
  };
}

export function saveProfile(twiteloUser, builder) {
  return async dispatch => {
    try {
      // start loadings
      dispatch({
        type: types.SET_PREVIEW_DATA,
        payload: {
          name: 'loading',
          value: true,
        },
      });
      dispatch({
        type: types.SET_BUILDER_LOADING,
        payload: true,
      });

      await dispatch(transformToUUID(twiteloUser, builder));

      const preview = (await api.post(`/user/me/save/profile`, {
        name: twiteloUser.name.content,
        description: twiteloUser.description.content,
        location: twiteloUser.location.content,
      })).data.data;

      // Update preview text
      dispatch({
        type: types.SET_PREVIEW_PROFILE,
        payload: preview,
      });

      // Stop loadings
      dispatch({
        type: types.SET_PREVIEW_DATA,
        payload: {
          name: 'loading',
          value: false,
        },
      });
      dispatch({
        type: types.SET_PREVIEW_DATA,
        payload: {
          name: 'needUpdate',
          value: false,
        },
      });
      dispatch({
        type: types.SET_PREVIEW_DATA,
        payload: {
          name: 'saved',
          value: true,
        },
      });

      return dispatch({
        type: types.SET_BUILDER_LOADING,
        payload: false,
      });
    } catch (error) {
      return dispatch(setError(error));
    }
  };
}

export function deleteAccount(twiteloUser, builder, account, userTags) {
  return async (dispatch, getState) => {
    try {
      const removeFromProfile = (text, ids) => {
        const re = new RegExp(ids.join('|'), 'g');
        return text.replace(re, '');
      };

      dispatch({
        type: types.SET_BUILDER_LOADING,
        payload: true,
      });

      await api.delete(`/account/me/${account.id}/delete`);
      await dispatch(transformToUUID(twiteloUser, builder));

      let newTwiteloUser = getState().user.twitelo;

      const tagsToDelete = _.filter(userTags, o => o.account_id === account.id);
      const tagIDsToDelete = tagsToDelete.map(tag => `<{${tag.id}}>`);

      const transformed = _.cloneDeep(newTwiteloUser);
      transformed.name.content = removeFromProfile(transformed.name.content.trim(), tagIDsToDelete);
      transformed.description.content = removeFromProfile(
        transformed.description.content.trim(),
        tagIDsToDelete,
      );
      transformed.location.content = removeFromProfile(
        transformed.location.content.trim(),
        tagIDsToDelete,
      );

      dispatch({
        type: types.SET_TWITELO_DATA,
        payload: transformed,
      });

      dispatch({
        type: types.DELETE_USER_TAGS,
        payload: tagsToDelete.map(tag => tag.id),
      });
      dispatch({
        type: types.DELETE_ACCOUNT,
        payload: account.id,
      });

      newTwiteloUser = getState().user.twitelo;
      let newBuilder = getState().builder;
      await dispatch(transformFromUUID(newTwiteloUser, newBuilder));
      newBuilder = getState().builder;
      await dispatch(updateTextCounters(newBuilder));

      return dispatch({
        type: types.SET_BUILDER_LOADING,
        payload: false,
      });
    } catch (error) {
      return dispatch(setError(error));
    }
  };
}

export function createTagAndUpdate({ destination, tagInfo, accountID, settings, dataSettings }) {
  return async (dispatch, getState) => {
    try {
      let twiteloUser = getState().user.twitelo;
      let { builder } = getState();

      dispatch({
        type: types.SET_BUILDER_LOADING,
        payload: true,
      });

      const tag = (await api.put(`/tag/me/create`, {
        settings,
        account_id: accountID,
        data_settings: dataSettings,
        tag_id: tagInfo.id,
        game_id: tagInfo.gameID,
      })).data.data;

      dispatch({
        type: types.ADD_USER_TAG,
        payload: tag,
      });
      ({ builder } = getState());
      await dispatch(transformToUUID(twiteloUser, builder));
      twiteloUser = getState().user.twitelo;
      ({ builder } = getState());
      await dispatch({
        type: types.SET_TWITELO_DATA_CONTENT,
        payload: {
          name: destination,
          content: `${twiteloUser[destination].content.trim()} <{${tag.id}}>`,
        },
      });
      twiteloUser = getState().user.twitelo;
      ({ builder } = getState());

      dispatch(transformFromUUID(twiteloUser, builder));

      return dispatch({
        type: types.SET_BUILDER_LOADING,
        payload: false,
      });
    } catch (error) {
      return dispatch(setError(error));
    }
  };
}
