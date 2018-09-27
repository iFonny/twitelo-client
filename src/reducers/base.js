import * as ActionType from '../actions/repos';

export const initialState = {
  switch: {
    disabled: false,
  },
  buttons: {
    langDisabled: false,
  },
  socket: {
    isConnected: false,
    reconnectError: false,
  },
  locales: ['en', 'fr'],
  locale: 'en',
  error: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ActionType.GET_TOP_REPOS:
      return state.set('isLoading', true);

    case ActionType.GET_TOP_REPOS_SUCCESS:
      return state.merge(
        Object.assign({}, action.payload, {
          isLoading: false,
          lang: action.lang,
        }),
      );

    default:
      return state;
  }
}
