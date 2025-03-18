import express from 'express';

import { optimizeImage } from './compress.middleware.js';
import createStorage from './multer.service.js';
import { uploadFile } from './storage.controller.js';

const Router = express.Router();

Router.post('/uploads/public', createStorage('public').any(), optimizeImage, uploadFile);
Router.post('/uploads/private', createStorage('private').any(), optimizeImage, uploadFile);

export default Router;
