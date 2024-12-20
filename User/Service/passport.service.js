import OpenIDConnectStrategy from 'passport-openidconnect';
import { Strategy as SamlStrategy } from 'passport-saml';

import { loginWithCredentals } from './user.service.js';

const createStrategy = (config) => {
  if (config.type === 'saml') {
    new SamlStrategy(
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
      });
  } else if (config.type === 'openidconnect') {
    return new OpenIDConnectStrategy({
      authorizationURL: config.authorizationURL,
      callbackURL: config.callbackURL,
      clientID: config.clientID,
      clientSecret: config.clientSecret,
      issuer: config.issuer,
      passReqToCallback: true,
      scope: config.scope,
      tokenURL: config.tokenURL,
      userInfoURL: config.userInfoURL
    },
    async (req, _, profile, cb) => {
      try {
        const email = profile.emails[0]?.value;
        // eslint-disable-next-line sonarjs/no-duplicate-string
        const loggedInUser = await loginWithCredentals({ email, isPassRequired: false, rememberMe: true, tenant: req.headers['x-tenant-id'] });
        return cb(null, loggedInUser);
      } catch (err) {
        return cb(err);
      }
    }
    );
  }
};

export default createStrategy;
