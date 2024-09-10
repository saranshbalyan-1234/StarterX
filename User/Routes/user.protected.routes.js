import express from 'express';

import {
  getAllUsers,
  getOrUpdateUser,
  logout
} from '../Controllers/user.controller.js';

const Router = express.Router();

Router.post('/', getOrUpdateUser);
Router.get('/', getAllUsers);
Router.get('/logout', logout);

export default Router;
