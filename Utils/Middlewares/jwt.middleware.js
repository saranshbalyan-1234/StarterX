import pkg from 'jsonwebtoken';

import errorContstants from '#constants/error.constant.js';
import cache from '#utils/cache.js';
import getError from '#utils/error.js';
import { getTenantDB } from '#utils/Mongo/mongo.connection.js';

const { verify } = pkg;
export const validateToken = () => async (req, res, next) => {
  try {
    if (req.path === '/socket.io/') return next();
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
      if (req.body) {
        if (Array.isArray(req.body)) {
          req.body.map(el => ({ ...el, createdBy: req.user._id, updatedBy: req.user._id }));
        } else {
          req.body.createdBy = req.user._id;
          req.body.updatedBy = req.user._id;
        }
      } else {
        req.body = {
          createdBy: req.user._id,
          updatedBy: req.user._id
        };
      }

      req.currentTenant = temp.currentTenant;
      req.isMaster = req.currentTenant === process.env.DATABASE_NAME;

      const db = await getTenantDB(req.currentTenant);
      req.models = db.models;

      const session = await db.startSession();
      session.startTransaction();
      req.mongosession = session;

      return next();
    }
  } catch (e) {
    getError(e, res);
  }
};

export const validateStorageTenant = () => (req, res, next) => {
  try {
    const accessTenant = req.path.split('/')[1];
    const currentTenant = req.currentTenant;
    if (accessTenant === currentTenant) return next();
    throw new Error(errorContstants.UNAUTHORIZED_TENANT, 401);
  } catch (e) {
    getError(e, res);
  }
};

const handleCachedTokenCheck = (email, token) => !(process.env.JWT_ACCESS_CACHE && cache.get(`accesstoken_${email}`) !== token);
