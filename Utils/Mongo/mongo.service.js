import mongoose from 'mongoose';

import { getDirectories } from '#utils/file.js';

const abortSession = (req) => {
  if (!req.mongosession) return;
  req.mongosession.abortTransaction().then(() => req.mongosession.endSession()).catch((er) => {
    console.error(er);
  });
};

const commitSession = (req) => {
  if (!req.mongosession) return;
  req.mongosession.commitTransaction().then(() => req.mongosession.endSession()).catch((er) => {
    console.error(er);
  });
};

const registerAllSchema = async (db, isMasterConn = false) => {
  try {
    const files = await getDirectories('.', 'schema');
    console.log('Registering Schemas', files.map(el => el.split('/').at(-1).split('.')[0]));
    const onlyMasterSchema = ['Customer', 'Unverified'];
    for (const file of files) {
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

const registerAllPlugins = async () => {
  try {
    const files =await getDirectories('.', 'plugin');

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

export { abortSession, commitSession, registerAllPlugins, registerAllSchema };
