import express from 'express';

// import { validate } from 'express-validation';
import { getCreateOrUpdateConfig } from '../Controllers/config.controller.js';
const Router = express.Router();

Router.post('/', getCreateOrUpdateConfig);

export default Router;
