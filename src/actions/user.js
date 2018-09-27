import types from './actionTypes';

export const setUser = user => ({
  type: types.SET_USER,
  payload: user,
});
