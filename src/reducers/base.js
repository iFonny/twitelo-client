import { toast } from 'react-toastify';
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
      toast.error(
        `${action.payload.message} (${action.payload.statusCode.toString()})`,
        {
          position: toast.POSITION.TOP_CENTER,
        },
      );
      return { ...state, error: action.payload };

    default:
      return state;
  }
}
