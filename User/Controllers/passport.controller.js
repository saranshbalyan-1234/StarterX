import passport from "passport";

import errorContstants from "#constants/error.constant.js";
import createStrategy from "#user/Service/passport.service.js";
import getError from "#utils/error.js";

export const passportTransporters = {};

const startStrategy = async (req, res, next) => {
  try {
    const tenant = req.headers["x-tenant-id"];
    const transporter = passportTransporters[tenant];

    if (!transporter) {
      const config = await req.models.config.findOne({ type: req.params.type });
      if (!config) {
        return res.status(404).json(errorContstants.RECORD_NOT_FOUND);
      }

      transporter = createStrategy(config);
      if (config.cache) passportTransporters[tenant] = transporter;

      if (!transporter) {
        return res.status(404).json(errorContstants.RECORD_NOT_FOUND);
      }
    }

    return passport.authenticate(transporter)(req, res, next);
  } catch (error) {
    getError(error, res);
  }
};

const callbackStrategy = async (req, res, next) => {
  try {
    const config = await req.models.config.findOne({ type: req.params.type });
    if (!config) {
      return res.status(404).json(errorContstants.RECORD_NOT_FOUND);
    }
    const strategy = createStrategy(config);
    if (!strategy) {
      return res.status(404).json(errorContstants.RECORD_NOT_FOUND);
    }

    return passport.authenticate(
      strategy,
      {
        failWithError: true,
        failureMessage: true,
        failureRedirect: `/passport/${config.type}/start`,
        session: false,
      },
      (err, user) => {
        if (err) throw err;
        return res.redirect(
          `${config.redirectionURL}?accessToken=${user.accessToken}&refreshToken=${user.refreshToken}`
        );
      }
    )(req, res, next);
  } catch (error) {
    getError(error, res);
  }
};

export { callbackStrategy, startStrategy };
