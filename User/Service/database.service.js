import errorContstants from '#constants/error.constant.js';
import { getTenantDB, removeTenantDB } from '#utils/Mongo/mongo.connection.js';
// import { deleteBucket } from '#storage/Service/awsService.js';

const deleteCustomer = async (tenant) => {
  try {
    console.debug('Deleting Tenant', tenant);

    await dropDatabase(tenant);
    await removeTenantDB(tenant);
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

const dropDatabase = async (database) => {
  if (database === process.env.DATABASE_PREFIX + process.env.DATABASE_NAME) throw new Error(errorContstants.UNABLE_TO_DELETE_MASTER_DATABASE);
  try {
    const conn = await getTenantDB(database, false);
    const res = await conn.db.dropDatabase((err, result) => {
      console.debug(err, result);
    });
    if (res) console.debug('Deleted', database);
    else console.debug('Unable to delete', database);
    return true;
  } catch (err) {
    console.error(err);
    console.error(`Unable to delete ${database}: Not Found`);
    return false;
  }
};
export { deleteCustomer, dropDatabase };
