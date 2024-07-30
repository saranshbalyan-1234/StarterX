import _ from 'lodash';

import cache from '#utils/cache.js';
import getError from '#utils/error.js';

import { deleteCustomer, getCachedKeys } from '../Service/database.js';

const getAllTenant = async (req, res) => {
  try {
    const tenants = await req.models.customer.distinct('tenant');
    return res.status(200).json(tenants);
  } catch (error) {
    getError(error, res);
  }
};

const deleteCustomerByAdmin = async (req, res) => {
  try {
    const { customerEmail } = req.body;
    await deleteCustomer(customerEmail);
    return res.status(200).json({ message: 'Deleted all data!' });
  } catch (error) {
    getError(error, res);
  }
};

const getAllSession = (_req, res) => {
  try {
    const sessions = getCachedKeys();
    const sessionObj = sessions
      .filter((el) => el.split('_')[0] === 'accesstoken')
      .map((el) => {
        const temp = {};
        const tempArr = el.split('_');
        temp.tenant = tempArr[1];
        temp.email = tempArr[2];
        return temp;
      });
    const result = _.groupBy(sessionObj, 'tenant');

    return res.status(200).json(result);
  } catch (error) {
    getError(error, res);
  }
};

const terminateSession = (req, res) => {
  try {
    const { email } = req.body;
    if (process.env.JWT_ACCESS_CACHE) cache.del(`accesstoken_${email}`);
    return res.status(200).json({ message: 'Session Terminated!' });
  } catch (error) {
    getError(error, res);
  }
};

export { deleteCustomerByAdmin, getAllSession, getAllTenant, terminateSession };