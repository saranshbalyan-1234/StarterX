import errorContstants from '#constants/error.constant.js';
import { deleteCustomer } from '#user/Service/database.service.js';
import { getCachedKeys } from '#utils/Cache/cache.service.js';
import cache from '#utils/Cache/index.js';
import { getTenantDB } from '#utils/Mongo/mongo.connection.js';
import getError from '#utils/error.js';

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

const deleteCustomerByAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    const tenant = process.env.DATABASE_PREFIX + email.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase();
    await deleteCustomer(tenant);
    const db = await getTenantDB();
    const result = await db.models.customer.updateMany({ tenant: { $elemMatch: { $eq: tenant } } }, { $pull: { tenant } });
    return res.status(200).json({ message: 'Deleted all data!', result });
  } catch (error) {
    getError(error, res);
  }
};

export { deleteCustomerByAdmin, getAllSession, getAllTenant, terminateSession };
