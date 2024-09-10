import errorContstants from '#constants/error.constant.js';
import { getTenantDB } from '#utils/Mongo/mongo.connection.js';

const dropDatabase = async (database) => {
  if (database === process.env.DATABASE_NAME) throw new Error(errorContstants.UNABLE_TO_DELETE_MASTER_DATABASE);
  try {
    const conn = await getTenantDB(database, false);
    const res = await conn.db.dropDatabase((err, result) => {
      console.log(err, result);
    });
    if (res) console.log('Deleted', database);
    else console.error('Unable to delete', database);
    return true;
  } catch (err) {
    throw new Error(err);
  }
};
export { dropDatabase };
