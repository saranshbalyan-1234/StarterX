import express from 'express';
import { validate } from 'express-validation';
import passport from 'passport';

import { login, register, resendVerificationMail, resetPassword, sendResetPasswordMail, verifyCustomer } from '../Controllers/auth.controller.js';
import { emailBodyValidation, loginValidation, registerValidation, tokenParamsValidation } from '../Validations/auth.js';
const Router = express.Router();

Router.post('/register', validate(registerValidation), register);
Router.post('/login', validate(loginValidation), login);
Router.get('/verify/:token', validate(tokenParamsValidation), verifyCustomer);
Router.post('/verify/send-mail', validate(emailBodyValidation), resendVerificationMail);
Router.post('/reset-password/send-mail', validate(emailBodyValidation), sendResetPasswordMail);
Router.post('/reset-password/:token', validate(tokenParamsValidation), resetPassword);

Router.get('/saml', passport.authenticate('saml'));
Router.post('/saml/callback', passport.authenticate('saml', { failureRedirect: '/auth/saml', session: false }), (req, res) => {
  console.log('saransh', req);
  const { accessToken, refreshToken } = req.user;
  return res.redirect(`${process.env.WEBSITE_HOME}/login?accessToken=${accessToken}&refreshToken=${refreshToken}`);
});

Router.get('/oidc', passport.authenticate('openidconnect'));
Router.get('/oidc/callback', passport.authenticate('openidconnect', { failWithError: true, failureMessage: true, session: false }), (req, res) => {
  console.log('saransh', req);
  const { accessToken, refreshToken } = req.user;
  return res.redirect(`${process.env.WEBSITE_HOME}/login?accessToken=${accessToken}&refreshToken=${refreshToken}`);
});
/*
 * Router.get('/refresh-token/:token', refreshToken);
 */

export default Router;
