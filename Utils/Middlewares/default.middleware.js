import { getTenantDB } from '#root/mongoConnection.js';

const defaultMiddleware = () => async (req, _res, next) => {
  try {
    const allowRoutes = ['auth'];
    if (!allowRoutes.includes(req.url.split('/')[1])) return next();

    const db = await getTenantDB();
    req.models = db.models;
    req.tenant = process.env.DATABASE_PREFIX + process.env.DATABASE_NAME;

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
