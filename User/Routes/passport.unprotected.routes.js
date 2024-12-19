import express from 'express';

import { callbackStrategy, startStrategy } from '../Controllers/passport.controller.js';

const Router = express.Router();

Router.get('/:type/start', startStrategy);
Router.get('/:type/callback', callbackStrategy);

export default Router;

/*
 * Router.get('/saml', passport.authenticate('saml'));
 * Router.post('/saml/callback', passport.authenticate('saml', { failureRedirect: '/auth/saml', session: false }), (req, res) => {
 *   console.log('saransh', req);
 *   const { accessToken, refreshToken } = req.user;
 *   return res.redirect(`${process.env.WEBSITE_HOME}/login?accessToken=${accessToken}&refreshToken=${refreshToken}`);
 * });
 */

/*
 * Router.get('/oidc', passport.authenticate('openidconnect'));
 * Router.get('/oidc/callback', passport.authenticate('openidconnect', { failWithError: true, failureMessage: true, session: false }), (req, res) => {
 *   console.log('saransh', req);
 *   const { accessToken, refreshToken } = req.user;
 *   return res.redirect(`${process.env.WEBSITE_HOME}/login?accessToken=${accessToken}&refreshToken=${refreshToken}`);
 * });
 */
