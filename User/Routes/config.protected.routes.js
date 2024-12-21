import express from 'express';

// import { validate } from 'express-validation';
import { createOrUpdateConfig, deleteConfig, findConfig, getAllConfigs } from '../Controllers/config.controller.js';
const Router = express.Router();

Router.post('/', createOrUpdateConfig);
Router.post('/:_id', findConfig);
Router.delete('/:_id', deleteConfig);
Router.get('/', getAllConfigs);

export default Router;
