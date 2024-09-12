import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';

import { loginWithCredentals } from './user.service.js';

/**
 * Sign in with Google.
 */
if (process.env.GOOGLE_ID && process.env.GOOGLE_SECRET) {
  const googleStrategyConfig = new GoogleStrategy(
    {
      callbackURL: '/auth/google/callback',
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      passReqToCallback: true
    },
    async (req, _accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails[0]?.value;
        // eslint-disable-next-line sonarjs/no-duplicate-string
        const loggedInUser = await loginWithCredentals({ email, isPassRequired: false, rememberMe: true, tenant: req.headers['x-tenant-id'] });
        return done(null, loggedInUser);
      } catch (err) {
        return done(err);
      }
    }
  );
  passport.use('google', googleStrategyConfig);
}

/**
 * Sign in with Microsoft.
 */
if (process.env.MICROSOFT_ID && process.env.MICROSOFT_SECRET) {
  const microsoftStrategyConfig = new MicrosoftStrategy(
    {
      callbackURL: '/auth/microsoft/callback',
      clientID: process.env.MICROSOFT_ID,
      clientSecret: process.env.MICROSOFT_SECRET,
      passReqToCallback: true,
      scope: ['user.read']
    },
    async (req, _accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails[0]?.value;
        // eslint-disable-next-line sonarjs/no-duplicate-string
        const loggedInUser = await loginWithCredentals({ email, isPassRequired: false, rememberMe: true, tenant: req.headers['x-tenant-id'] });
        return done(null, loggedInUser);
      } catch (err) {
        return done(err);
      }
    }
  );
  passport.use('microsoft', microsoftStrategyConfig);
}

/**
 * Sign in with GitHub.
 */
if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  const githubStrategyConfig = new GitHubStrategy(
    {
      callbackURL: '/auth/github/callback',
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      passReqToCallback: true,
      scope: ['user:email']
    },
    async (req, _accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails[0]?.value;
        // eslint-disable-next-line sonarjs/no-duplicate-string
        const loggedInUser = await loginWithCredentals({ email, isPassRequired: false, rememberMe: true, tenant: req.headers['x-tenant-id'] });
        return done(null, loggedInUser);
      } catch (err) {
        return done(err);
      }
    }
  );
  passport.use('github', githubStrategyConfig);
}

/**
 * Sign in with LinkedIn.
 */
if (process.env.LINKEDIN_ID && process.env.LINKEDIN_SECRET) {
  passport.use(
    new LinkedInStrategy(
      {
        callbackURL: '/auth/linkedin/callback',
        clientID: process.env.LINKEDIN_ID,
        clientSecret: process.env.LINKEDIN_SECRET,
        passReqToCallback: true,
        scope: ['profile']
      },
      async (req, _accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails[0]?.value;
          // eslint-disable-next-line sonarjs/no-duplicate-string
          const loggedInUser = await loginWithCredentals({ email, isPassRequired: false, rememberMe: true, tenant: req.headers['x-tenant-id'] });
          return done(null, loggedInUser);
        } catch (err) {
          console.log(err);
          return done(err);
        }
      }
    )
  );
}

export default {};
