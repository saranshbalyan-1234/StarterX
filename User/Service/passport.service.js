import OpenIDConnectStrategy from 'passport-openidconnect';
import { Strategy as SamlStrategy } from 'passport-saml';

import { loginWithCredentals } from './user.service.js';

const createStrategy = (config) => {
  if (config.type === 'saml') {
    return new SamlStrategy(
      {
        cert: config.cert,
        entityId: config.entityId,
        entryPoint: config.entryPoint,
        issuer: config.issuer,
        passReqToCallback: true,
        path: config.path
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
