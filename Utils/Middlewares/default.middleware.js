import { getTenantDB } from '#utils/Mongo/mongo.connection.js';

const defaultMiddleware = () => async (req, _res, next) => {
  try {
    const allowRoutes = ['auth', 'superadmin'];
    if (!allowRoutes.includes(req.url.split('/')[1])) return next();

    const db = await getTenantDB();
    req.models = db.models;

    req.currentTenant = process.env.DATABASE_PREFIX + process.env.DATABASE_NAME;
    req.masterTenant = process.env.DATABASE_PREFIX + process.env.DATABASE_NAME;
    req.isMaster = true

    const session = await db.startSession();
    session.startTransaction();
    req.session = session;

    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export default defaultMiddleware;
