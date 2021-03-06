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
  let newState;

  switch (action.type) {
    case types.SET_GAMES:
      return { ...state, games: action.payload };

    case types.SET_SELECTED_GAME:
      return { ...state, selectedGame: action.payload };

    case types.SET_GAME_TAGS_CATEGORY:
      return { ...state, gameTagsCategory: action.payload };

    case types.SET_GAME_TAGS_CATEGORY_PAGES:
      return { ...state, gameTagsCategoryPages: action.payload };

    case types.SET_USER_TAGS:
      return { ...state, userTags: action.payload };

    case types.SET_ACCOUNT_SETTINGS:
      return { ...state, accountSettings: action.payload };

    case types.DELETE_USER_TAGS:
      return { ...state, userTags: _.filter(state.userTags, o => !action.payload.includes(o.id)) };

    case types.DELETE_USER_TAG:
      return { ...state, userTags: _.filter(state.userTags, (o, key) => key !== action.payload) };

    case types.ADD_USER_TAG:
      return { ...state, userTags: [...state.userTags, action.payload] };

    case types.DELETE_ACCOUNT:
      newState = {
        ...state,
        allAccounts: _.omit(state.allAccounts, [action.payload]),
      };

      return {
        ...newState,
        accounts: _.groupBy(newState.allAccounts, 'game_id'),
      };

    case types.SET_ALL_ACCOUNTS:
      return {
        ...state,
        allAccounts: action.payload,
        accounts: _.groupBy(action.payload, 'game_id'),
      };

    case types.UPDATE_ACCOUNT:
      newState = {
        ...state,
        allAccounts: {
          ...state.allAccounts,
          [action.payload.id]: action.payload,
        },
      };

      return {
        ...newState,
        accounts: _.groupBy(newState.allAccounts, 'game_id'),
      };

    case types.SET_TWITELO_DATA_INPUT:
      return {
        ...state,
        twiteloDataInput: {
          ...state.twiteloDataInput,
          [action.payload.name]: action.payload.value,
        },
      };

    case types.SET_TWITELO_DATA_INPUT_ALL:
      return {
        ...state,
        twiteloDataInput: action.payload,
      };

    case types.SET_TEXT_COUNTER:
      return {
        ...state,
        textCounter: {
          ...state.textCounter,
          [action.payload.name]: action.payload.value,
        },
      };

    case types.SET_PREVIEW_DATA:
      return {
        ...state,
        preview: {
          ...state.preview,
          [action.payload.name]: action.payload.value,
        },
      };

    case types.SET_PREVIEW_PROFILE:
      return {
        ...state,
        preview: {
          ...state.preview,
          name: action.payload.name.replace(/<{(.+?)}>/g, '<span class="tag is-cyan">$1</span>'),
          description: action.payload.description.replace(
            /<{(.+?)}>/g,
            '<span class="tag is-cyan">$1</span>',
          ),
          location: action.payload.location.replace(
            /<{(.+?)}>/g,
            '<span class="tag is-cyan">$1</span>',
          ),
        },
      };

    case types.SET_BUILDER_LOADING:
      return {
        ...state,
        builderLoading: action.payload,
      };

    case types.SET_USER_TAG_NOT_INCLUDED:
      return {
        ...state,
        userTags: state.userTags.map(
          (userTag, index) =>
            index === parseInt(action.payload, 10)
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
            index === parseInt(action.payload, 10)
              ? {
                  ...userTag,
                  included: true,
                }
              : { ...userTag },
        ),
      };

    case types.UPDATE_USER_TAG:
      return {
        ...state,
        userTags: state.userTags.map(
          (userTag, index) =>
            index === parseInt(action.payload.index, 10) ? { ...action.payload } : { ...userTag },
        ),
      };

    default:
      return state;
  }
}
