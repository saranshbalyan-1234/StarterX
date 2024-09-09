import pkg from 'jsonwebtoken';

import errorContstants from '#constants/error.constant.js';
import cache from '#utils/Cache/index.js';
import getError from '#utils/error.js';
import { getTenantDB } from '#utils/Mongo/mongo.connection.js';

const { verify } = pkg;
export const validateToken = () => async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) throw new Error(errorContstants.ACCESS_TOKEN_NOT_FOUND, 401, 'JsonWebTokenError');
    const data = verify(token, process.env.JWT_ACCESS_SECRET);
    if (data) {
      const tokenCheck = handleCachedTokenCheck(data.email, token);
      if (!tokenCheck) throw new Error(errorContstants.ACCESS_TOKEN_NOT_FOUND, 401, 'JsonWebTokenError');

      const temp = { ...data };
      delete temp.iat;
      delete temp.exp;
      req.user = temp;

      req.currentTenant = temp.currentTenant;
      req.masterTenant = process.env.DATABASE_PREFIX + process.env.DATABASE_NAME;
      req.isMaster = req.currentTenant === req.masterTenant;

      const db = await getTenantDB(req.currentTenant);
      req.models = db.models;

      const session = await db.startSession();
      session.startTransaction();
      req.session = session;

      next();
    }
  } catch (e) {
    getError(e, res);
  }
};

const handleCachedTokenCheck = (email, token) => !(process.env.JWT_ACCESS_CACHE && cache.get(`accesstoken_${email}`) !== token);
