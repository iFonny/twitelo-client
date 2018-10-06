import types from '../actions/actionTypes';

export const initialState = null;

export default function(state = initialState, action) {
  switch (action.type) {
    case types.SET_USER:
      return { ...action.payload };

    case types.SET_USER_SWITCH:
      return { ...state, switch: action.payload };

    case types.SET_USER_TWITELO_SWITCH:
      return {
        ...state,
        twitelo: {
          ...state.twitelo,
          [action.payload.name]: {
            ...state.twitelo[action.payload.name],
            status: action.payload.status,
          },
        },
      };

    case types.SET_USER_LANG:
      return {
        ...state,
        settings: { ...state.settings, locale: action.payload },
      };

    case types.SET_TWITELO_DATA:
      return {
        ...state,
        twitelo: action.payload,
      };

    case types.SET_TWITELO_DATA_CONTENT:
      return {
        ...state,
        twitelo: {
          ...state.twitelo,
          [action.payload.name]: {
            ...state.twitelo[action.payload.name],
            content: action.payload.content,
          },
        },
      };

    default:
      return state;
  }
}
