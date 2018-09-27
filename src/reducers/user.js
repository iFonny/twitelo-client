import types from '../actions/actionTypes';

export const initialState = null;

export default function(state = initialState, action) {
  switch (action.type) {
    case types.SET_USER:
      return { ...action.payload };

    default:
      return state;
  }
}
