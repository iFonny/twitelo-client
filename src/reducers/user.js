import types from '../actions/actionTypes';

export const initialState = null;

export default function(state = initialState, action) {
  switch (action.type) {
    case types.SET_USER:
      return { ...action.payload };

    case types.SET_USER_SWITCH:
      return { ...state, switch: action.payload };

    case types.SET_USER_LANG:
      return {
        ...state,
        settings: { ...state.settings, locale: action.payload },
      };

    default:
      return state;
  }
}
