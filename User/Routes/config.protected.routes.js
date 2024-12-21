import express from 'express';

// import { validate } from 'express-validation';
import { createConfig, deleteConfig, findConfig, findManyConfig, updateConfig } from '../Controllers/config.controller.js';
const Router = express.Router();

Router.post('/', createConfig);
Router.put('/:_id', updateConfig);
Router.get('/:_id', findConfig);
Router.delete('/:_id', deleteConfig);
Router.get('/', findManyConfig);

export default Router;
