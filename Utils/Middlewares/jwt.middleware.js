import pkg from 'jsonwebtoken';

import errorContstants from '#constants/error.constant.js';
import cache from '#utils/Cache/index.js';
import { getTenantDB } from '#utils/Database/mongo.connection.js';
import getError from '#utils/error.js';

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
      req.tenant = temp.currentTenant;

      const db = await getTenantDB(req.tenant);
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
