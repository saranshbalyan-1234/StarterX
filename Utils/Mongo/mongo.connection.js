import mongoose from 'mongoose';

import { getDirectories } from '#utils/file.js';

const clientOption = {
  /*
   * SocketTimeoutMS: 30000,
   * ServerSelectionTimeoutMS:30000,
   */
  maxPoolSize: 100,
  minPoolSize: 5
};
const connectionsObj = {};
mongoose.set('debug', true);

const registerAllPlugins = async () => {
  try {
    const files = getDirectories('.', 'plugin');

    for (const file of files) {
      const schema = await import(`../../${file}`);
      const defaultFile = schema.default;
      mongoose.plugin(defaultFile);
    };
    console.log('Registered All Plugins');
  } catch (err) {
    console.error(err);
  }
};

registerAllPlugins();

//setting lean for mongoose
const __setOptions = mongoose.Query.prototype.setOptions;
mongoose.Query.prototype.setOptions = function setOptions (...args) {
  __setOptions.apply(this, args);
  if (!this.mongooseOptions().lean) this.mongooseOptions().lean = true;
  return this;
};

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close();
  console.error('Application crashed');
  process.exit(0);
});

export const createDbConnection = async (tenant = process.env.DATABASE_NAME, autoIndex = true) => {
  try {
    console.log(`Establishing ${tenant} db connection`);
    const isMasterConn = tenant === process.env.DATABASE_NAME;
    const DB_URL = process.env.DATABASE_URL;
    const conn = mongoose.createConnection(DB_URL.at(-1) === '/' ? DB_URL + tenant : `${DB_URL}/${tenant}`, { ...clientOption, autoIndex });
    await conn.$initialConnection; // wait for connection to get established
    if (autoIndex) await registerAllSchema(conn, isMasterConn);
    connectionEvents(conn);
    connectionsObj[tenant] = conn;
    console.debug('Active connections', Object.keys(connectionsObj));
    return conn;
  } catch (error) {
    console.error('Error while connecting to DB', error);
  }
};

const registerAllSchema = async (db, isMasterConn = false) => {
  console.log("Registering Schema")
  try {
    const files = getDirectories('.', 'schema');
    const onlyMasterSchema = ['Customer', 'Unverified'];
    for (const file of files) {
      console.debug(file,onlyMasterSchema.some(el => file.includes(el)))
      if (isMasterConn || !onlyMasterSchema.some(el => file.includes(el))) {
        const schema = await import(`../../${file}`);
        const defaultFile = schema.default;

        const tempAr = file.split('.');
        const tempAr1 = tempAr[tempAr.length - 3].split('/');
        const name = tempAr1[tempAr1.length - 1];

        await db.model(name.toLowerCase(), defaultFile);
      }
    };
  } catch (err) {
    console.error(err);
  }
};

const connectionEvents = (conn) => {
  try {
    conn.on('connected', () => console.success(conn.name, 'connected'));
    conn.on('open', () => console.log(conn.name, 'open'));
    conn.on('disconnected', () => console.error(conn.name, 'disconnected'));
    conn.on('reconnected', () => console.log(conn.name, 'reconnected'));
    conn.on('disconnecting', () => console.error(conn.name, 'disconnecting'));
    conn.on('close', () => console.log(conn.name, 'close'));
  } catch (err) {
    console.error(err);
  }
};

export const getTenantDB = async (tenant = process.env.DATABASE_NAME, autoIndex = true) => {
  try {
    const connection = connectionsObj[tenant];
    if (connection) return connection;
    return await createDbConnection(tenant, autoIndex);
  } catch (err) {
    console.error(err);
  }
};

export const removeTenantDB = async (tenant = process.env.DATABASE_NAME) => {
  try {
    console.debug('closing connection');
    const connection = connectionsObj[tenant];
    if (!connection) throw new Error('No connection found!');
    await connection.close();
    delete connectionsObj[tenant];
    console.debug('Active connections', Object.keys(connectionsObj));

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
