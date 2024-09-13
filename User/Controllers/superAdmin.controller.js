import errorContstants from '#constants/error.constant.js';
import { dropDatabase } from '#user/Service/database.service.js';
import { getCachedKeys } from '#utils/Cache/cache.service.js';
import cache from '#utils/Cache/index.js';
import getError from '#utils/error.js';
import { removeTenantDB } from '#utils/Mongo/mongo.connection.js';

const getAllTenant = async (req, res) => {
  try {
    const tenants = await req.models.customer.distinct('tenant');
    return res.status(200).json(tenants);
  } catch (error) {
    getError(error, res);
  }
};

const getAllSession = (_req, res) => {
  try {
    const sessions = getCachedKeys();
    return res.status(200).json(sessions);
  } catch (error) {
    getError(error, res);
  }
};

const terminateSession = (req, res) => {
  try {
    const { email } = req.body;
    if (!process.env.JWT_ACCESS_CACHE) throw new Error(errorContstants.SESSION_OFF);
    if (!cache.get(`accesstoken_${email}`)) throw new Error(errorContstants.NOT_AN_ACTIVE_SESSION);
    cache.del(`accesstoken_${email}`);
    return res.status(200).json({ message: 'Session Terminated!' });
  } catch (error) {
    getError(error, res);
  }
};

const removeTenant = async (req, res) => {
  try {
    const { tenant } = req.body;

    const customers = await req.models.customer.find({ tenant });
    if (!customers.length) throw new Error(errorContstants.RECORD_NOT_FOUND);

    await dropDatabase(tenant);
    await removeTenantDB(tenant);

    await req.models.customer.updateMany({ tenant: { $elemMatch: { $eq: tenant } } }, { $pull: { tenant } });
    await req.models.customer.deleteMany({ tenant: { $exists: true, $size: 0 } });
    return res.status(200).json({ message: 'Deleted Tenant!' });
  } catch (error) {
    getError(error, res);
  }
};

export { getAllSession, getAllTenant, removeTenant, terminateSession };
