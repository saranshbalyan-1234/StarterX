import express from 'express';

import { validateSuperAdmin } from '#middlewares/permissions.middleware.js';

import { removeTenant, getAllSession, getAllTenant, terminateSession } from '../Controllers/superAdmin.controller.js';
const Router = express.Router();

Router.use(validateSuperAdmin());

Router.get('/tenant', getAllTenant);
Router.post('/remove-tenant', removeTenant);
Router.get('/session', getAllSession);
Router.post('/terminate-session', terminateSession);

export default Router;
