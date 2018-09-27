import types from '../actions/actionTypes';

export const initialState = {
  switch: {
    disabled: false,
  },
  locales: ['en', 'fr'],
  error: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.SET_ERROR:
      return { ...state, error: action.payload };

    default:
      return state;
  }
}
