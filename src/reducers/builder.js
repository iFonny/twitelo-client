import _ from 'lodash';

import types from '../actions/actionTypes';

export const initialState = {
  builderLoading: false,
  twitterLimits: {
    description: 160,
    location: 70, // Twitter : 150
    name: 50,
  },
  textCounter: {
    description: 160,
    location: 70,
    name: 50,
  },
  twiteloDataInput: {
    description: '',
    location: '',
    name: '',
  },
  selectedGame: null,
  games: {},
  gameTagsCategory: null,
  gameTagsCategoryPages: [],
  userTags: [],
  accountSettings: null,
  allAccounts: {},
  accounts: {},
  preview: {
    saved: true,
    loading: false,
    needUpdate: true,
    name: 'Name',
    description: 'Description',
    location: 'Location',
  },
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.SET_GAMES:
      return { ...state, games: action.payload };

    case types.SET_USER_TAGS:
      return { ...state, userTags: action.payload };

    case types.SET_ACCOUNT_SETTINGS:
      return { ...state, accountSettings: action.payload };

    case types.SET_ALL_ACCOUNTS:
      return {
        ...state,
        allAccounts: action.payload,
        accounts: _.groupBy(state.allAccounts, 'game_id'),
      };

    case types.SET_TWITELO_DATA_INPUT_ALL:
      return {
        ...state,
        twiteloDataInput: action.payload,
      };

    case types.SET_USER_TAG_NOT_INCLUDED:
      return {
        ...state,
        userTags: state.userTags.map(
          (userTag, index) =>
            index === action.payload
              ? {
                  ...userTag,
                  included: false,
                }
              : { ...userTag },
        ),
      };

    case types.SET_USER_TAG_INCLUDED:
      return {
        ...state,
        userTags: state.userTags.map(
          (userTag, index) =>
            index === action.payload
              ? {
                  ...userTag,
                  included: true,
                }
              : { ...userTag },
        ),
      };

    default:
      return state;
  }
}
