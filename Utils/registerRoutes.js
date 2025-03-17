import express from 'express';

import errorContstants from '#constants/error.constant.js';
import { validateToken } from '#middlewares/jwt.middleware.js';
import { setupPrometheus } from '#middlewares/server.middleware.js';
import { getDirectories } from '#utils/file.js';
const getRoutes = async (app, type) => {
  app.use('/storage/asset', express.static('assets'));
  app.use('/storage/public', express.static('uploads/public'));
  app.use('/storage/private', validateToken(), express.static('uploads/private'));

  const files = getDirectories('.', type);

  for (let i = 0; i < files.length; i++) {
    const element = files[i];
    const route = await import(`../${element}`);
    const defaultFile = route.default;

    const tempAr = element.split('.');
    const tempAr1 = tempAr[tempAr.length - 4].split('/');
    const name = tempAr1[tempAr1.length - 1];

    if (element.includes('unprotected')) app.use(`/${name}`, defaultFile);
    else if (element.includes('protected')) app.use(`/${name}`, validateToken(), defaultFile);
  };
  console.success('Routes Registered');
};

const registerRoutes = async (app) => {
  setupPrometheus(app);
  await getRoutes(app, 'routes');
  app.use((_req, res) => res.status(404).json({ error: errorContstants.ENDPOINT_NOT_FOUND }));
  //  console.success('Routes Registered');
};

export default registerRoutes;
