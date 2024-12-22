import cookieSession from 'cookie-session';
import express from 'express';

import { callbackStrategy, startStrategy } from '../Controllers/passport.controller.js';

const Router = express.Router();

const middleware = cookieSession({
  keys: ['cookie-secret'],
  maxAge: 10 * 60 * 1000,
  name: 'session'
});

Router.get('/:type/start', middleware, startStrategy);
Router.get('/:type/callback', middleware, callbackStrategy);

export default Router;
