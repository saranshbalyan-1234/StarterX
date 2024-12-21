import express from 'express';
// import MongoStore from 'connect-mongo';
import session from 'express-session';

import { callbackStrategy, startStrategy } from '../Controllers/passport.controller.js';

const Router = express.Router();

const middleware = session({
  cookie: {
    httpOnly: true,
    maxAge: 60 * 1000,
    secure: false
  },
  resave: false,
  saveUninitialized: false,
  secret: 'saransh'
/*
 *     store: MongoStore.create({
 *       mongoUrl: 'mongodb+srv://saransh:ysoserious@saransh.jvitvgq.mongodb.net/passport-session'
 *   })
 */
});

Router.get('/:type/start', middleware, startStrategy);
Router.get('/:type/callback', middleware, callbackStrategy);

export default Router;
