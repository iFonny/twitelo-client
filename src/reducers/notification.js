import types from '../actions/actionTypes';

export const initialState = [];

export default function(state = initialState, action) {
  switch (action.type) {
    case types.SET_NOTIFICATIONS:
      return { ...action.payload };

    default:
      return state;
  }
}
