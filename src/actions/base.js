import types from './actionTypes';

export default function setError(e) {
  let errFormat = {};

  if (e.response && e.response.data && e.response.data.status && e.response.data.data) {
    errFormat = {
      statusCode: e.response.data.status,
      message: e.response.data.data,
    };
  } else if (e.response) {
    const code = parseInt(e.response && e.response.status, 10);
    errFormat = {
      statusCode: code,
      message: e.response.statusText,
    };
  } else {
    console.error(e);
    errFormat = {
      statusCode: 520,
      message: 'Unknown Error',
    };
  }

  return {
    type: types.SET_ERROR,
    payload: errFormat,
  };
}
