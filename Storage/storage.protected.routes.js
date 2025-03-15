import express from 'express';

import { optimizeImage } from './compress.middleware.js';
import upload from './multer.service.js';
import { uploadFile } from './storage.controller.js';
const Router = express.Router();

Router.post('/upload', upload.any(), optimizeImage, uploadFile);

export default Router;
