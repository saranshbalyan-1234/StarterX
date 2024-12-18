import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import OpenIDConnectStrategy from 'passport-openidconnect';
import { Strategy as SamlStrategy } from 'passport-saml';

import { loginWithCredentals } from './user.service.js';

/**
 * Sign in with Google.
 */
if (process.env.GOOGLE_ID && process.env.GOOGLE_SECRET) {
  const googleStrategyConfig = new GoogleStrategy(
    {
      callbackURL: '/passport/google/callback',
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

passport.use(new SamlStrategy(
  {
    cert: 'MIIC4jCCAcoCCQC33wnybT5QZDANBgkqhkiG9w0BAQsFADAyMQswCQYDVQQGEwJV SzEPMA0GA1UECgwGQm94eUhRMRIwEAYDVQQDDAlNb2NrIFNBTUwwIBcNMjIwMjI4 MjE0NjM4WhgPMzAyMTA3MDEyMTQ2MzhaMDIxCzAJBgNVBAYTAlVLMQ8wDQYDVQQK DAZCb3h5SFExEjAQBgNVBAMMCU1vY2sgU0FNTDCCASIwDQYJKoZIhvcNAQEBBQAD ggEPADCCAQoCggEBALGfYettMsct1T6tVUwTudNJH5Pnb9GGnkXi9Zw/e6x45DD0 RuRONbFlJ2T4RjAE/uG+AjXxXQ8o2SZfb9+GgmCHuTJFNgHoZ1nFVXCmb/Hg8Hpd 4vOAGXndixaReOiq3EH5XvpMjMkJ3+8+9VYMzMZOjkgQtAqO36eAFFfNKX7dTj3V pwLkvz6/KFCq8OAwY+AUi4eZm5J57D31GzjHwfjH9WTeX0MyndmnNB1qV75qQR3b 2/W5sGHRv+9AarggJkF+ptUkXoLtVA51wcfYm6hILptpde5FQC8RWY1YrswBWAEZ NfyrR4JeSweElNHg4NVOs4TwGjOPwWGqzTfgTlECAwEAATANBgkqhkiG9w0BAQsF AAOCAQEAAYRlYflSXAWoZpFfwNiCQVE5d9zZ0DPzNdWhAybXcTyMf0z5mDf6FWBW 5Gyoi9u3EMEDnzLcJNkwJAAc39Apa4I2/tml+Jy29dk8bTyX6m93ngmCgdLh5Za4 khuU3AM3L63g7VexCuO7kwkjh/+LqdcIXsVGO6XDfu2QOs1Xpe9zIzLpwm/RNYeX UjbSj5ce/jekpAw7qyVVL4xOyh8AtUW1ek3wIw1MJvEgEPt0d16oshWJpoS1OT8L r/22SvYEo3EmSGdTVGgk3x3s+A0qWAqTcyjr7Q4s/GKYRFfomGwz0TZ4Iw1ZN99M m0eo2USlSRTVl7QHRTuiuSThHpLKQQ==',
    entityId: 'https://saml.example.com/entityid',
    entryPoint: 'https://mocksaml.com/api/saml/sso',
    issuer: 'passport-saml',
    passReqToCallback: true,
    path: '/auth/saml/callback'
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
  }));

passport.use(new OpenIDConnectStrategy({
  authorizationURL: process.env.OIDC_AUTH_URL,
  callbackURL: process.env.OIDC_AUTH_CALLBACK,
  clientID: process.env.OIDC_CLIENT_ID,
  clientSecret: process.env.OIDC_CLIENT_SECRET,
  issuer: process.env.OIDC_ISSUER,
  passReqToCallback: true,
  scope: process.env.OIDC_SCOPE,
  state: false,
  tokenURL: process.env.OIDC_TOKEN_URL,
  userInfoURL: process.env.OIDC_USER_INFO_URL

},
async (req, _, profile, cb) => {
  console.log(cb);
  try {
    const email = profile.emails[0]?.value;
    // eslint-disable-next-line sonarjs/no-duplicate-string
    const loggedInUser = await loginWithCredentals({ email, isPassRequired: false, rememberMe: true, tenant: req.headers['x-tenant-id'] });
    return cb(null, loggedInUser);
  } catch (err) {
    return cb(err);
  }
}
));

export default {};
