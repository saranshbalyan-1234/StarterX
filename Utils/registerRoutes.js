import errorContstants from '#constants/error.constant.js';
import { validateToken } from '#middlewares/jwt.middleware.js';
import { setupPrometheus } from '#middlewares/server.middleware.js';
import { getDirectories } from '#utils/file.js';

const getRoutes = async (app, type) => {
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
  console.log(type, 'registered');
};

const registerRoutes = async (app) => {
  setupPrometheus(app);
  await getRoutes(app, 'routes');
  app.use((_req, res) => res.status(404).json({ error: errorContstants.ENDPOINT_NOT_FOUND }));
  return console.success('Routes Registered');
};

export default registerRoutes;
