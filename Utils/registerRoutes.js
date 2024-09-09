import errorContstants from '#constants/error.constant.js';
import { validateToken } from '#middlewares/jwt.middleware.js';
import { getDirectories } from '#utils/file.js';

const getRoutes = async (app, type) => {
  const files = getDirectories('.', type);

  for (let i = 0; i < files.length; i++) {
    const element = files[i];
    const route =  await import(`../${element}`);
    const defaultFile = route.default;

    const tempAr = element.split('.');
    const tempAr1 = tempAr[tempAr.length - 4].split('/');
    const name = tempAr1[tempAr1.length - 1];

    app.use(`${name}`, defaultFile);
  };
  console.log(type, 'registred');
};

const registerUnprotectedRoutes = async (app) => {
  await getRoutes(app, 'unprotected.routes');
};

const registerProtectedRoutes = async (app) => {
  await app.use(validateToken());
  await getRoutes(app, 'protected.routes');
};

const registerRoutes = async (app) => {
  await registerUnprotectedRoutes(app);
  await registerProtectedRoutes(app);
  app.use((_req, res) => res.status(404).json({ error: errorContstants.ENDPOINT_NOT_FOUND }));
  return console.success('Routes Registered');
};

export default registerRoutes;
