import { getTenantDB } from '#utils/Mongo/mongo.connection.js';

const defaultMiddleware = () => async (req, _res, next) => {
  try {
    const allowRoutes = ['auth', 'superadmin'];
    if (!allowRoutes.includes(req.url.split('/')[1])) return next();

    const db = await getTenantDB();
    req.models = db.models;

    req.currentTenant = process.env.DATABASE_NAME;
    req.isMaster = true;

    const session = await db.startSession();
    session.startTransaction();
    req.mongosession = session;

    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export default defaultMiddleware;
