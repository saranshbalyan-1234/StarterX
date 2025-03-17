import express from 'express';

import { optimizeImage } from './compress.middleware.js';
import { uploadPrivate, uploadPublic } from './multer.service.js';
import { uploadFile } from './storage.controller.js';

const Router = express.Router();

Router.post('/upload/public', uploadPublic.any(), optimizeImage, uploadFile);
Router.post('/upload/private', uploadPrivate.any(), optimizeImage, uploadFile);

export default Router;
