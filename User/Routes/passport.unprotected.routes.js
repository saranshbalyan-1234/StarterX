import express from 'express';
import passport from 'passport';

import {} from '#user/Service/passport.service.js';
const Router = express.Router();

if (process.env.GOOGLE_ID && process.env.GOOGLE_SECRET) {
  Router.get('/google', passport.authenticate('google', { scope: ['email'], session: false }));
  Router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/auth/google', session: false }), (req, res) => {
    const { accessToken, refreshToken } = req.user;
    return res.redirect(`${process.env.WEBSITE_HOME}/login?accessToken=${accessToken}&refreshToken=${refreshToken}`);
  });
}

if (process.env.MICROSOFT_ID && process.env.MICROSOFT_SECRET) {
  Router.get('/microsoft', passport.authenticate('microsoft'));
  Router.get('/microsoft/callback', passport.authenticate('microsoft', { failureRedirect: '/auth/microsoft', session: false }), (req, res) => {
    const { accessToken, refreshToken } = req.user;
    return res.redirect(`${process.env.WEBSITE_HOME}/login?accessToken=${accessToken}&refreshToken=${refreshToken}`);
  });
}

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  Router.get('/github', passport.authenticate('github'));
  Router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/auth/github', session: false }), (req, res) => {
    const { accessToken, refreshToken } = req.user;
    return res.redirect(`${process.env.WEBSITE_HOME}/login?accessToken=${accessToken}&refreshToken=${refreshToken}`);
  });
}
export default Router;
