import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import config from '../../config/cursor';
import rootReducer from '../reducers';

function createMiddlewares() {
  const middlewares = [thunkMiddleware];

  if (config.env === 'dev' && typeof window !== 'undefined') {
    middlewares.push(
      createLogger({
        level: 'info',
        collapsed: true,
      }),
    );
  }

  return middlewares;
}

/**
 * @param {object} initialState
 * @param {boolean} context.isServer indicates whether it is a server side or client side
 * @param {Request} context.req NodeJS Request object (not set when client applies initialState from server)
 * @param {Request} context.res NodeJS Request object (not set when client applies initialState from server)
 * @param {boolean} context.debug User-defined debug mode param
 * @param {string} context.storeKey This key will be used to preserve store in global namespace for safe HMR
 */
export default (initialState = {}, context) => {
  const { isServer } = context;
  const middlewares = createMiddlewares({ isServer });

  return createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middlewares)),
  );
};
