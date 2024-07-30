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
  const files = getDirectories('.', 'plugin');

  for (const file of files) {
    const schema = await import(file);
    const defaultFile = schema.default;
    mongoose.plugin(defaultFile);
  };
  console.log('Registered All Plugins');
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

export const createDbConnection = async (tenant = process.env.DATABASE_PREFIX + process.env.DATABASE_NAME) => {
  try {
    console.log(`Establishing ${tenant} db connection`);
    const DB_URL = process.env.DATABASE_URL;
    const conn = mongoose.createConnection(DB_URL.at(-1) === '/' ? DB_URL + tenant : `${DB_URL}/${tenant}`, clientOption);
    await conn.$initialConnection; // wait for connection to get established
    await registerAllSchema(conn);
    connectionEvents(conn);
    connectionsObj[tenant] = conn;
    console.log('Connection Established');
    return conn;
  } catch (error) {
    console.log('Error while connecting to DB', error);
  }
};

const registerAllSchema = async (db) => {
  const files = getDirectories('.', 'schema');
  for (const file of files) {
    const schema = await import(file);
    const defaultFile = schema.default;

    const tempAr = file.split('.');
    const tempAr1 = tempAr[tempAr.length - 3].split('/');
    const name = tempAr1[tempAr1.length - 1];

    await db.model(name.toLowerCase(), defaultFile);
  };
};

const connectionEvents = (conn) => {
  conn.on('connected', () => console.success('connected'));
  conn.on('open', () => console.log('open'));
  conn.on('disconnected', () => console.error('disconnected'));
  conn.on('reconnected', () => console.log('reconnected'));
  conn.on('disconnecting', () => console.error('disconnecting'));
  conn.on('close', () => console.log('close'));
};

export const getTenantDB = async (tenant = process.env.DATABASE_PREFIX + process.env.DATABASE_NAME) => {
  const connection = connectionsObj[tenant];
  if (connection) return connection;
  return await createDbConnection(tenant);
};