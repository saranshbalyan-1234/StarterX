import express from 'express';

import { collectFilesBeforeMulter, optimizeImage } from './compress.middlewre.js';
import upload from './multer.service.js';
import { uploadFile } from './storage.controller.js';
const Router = express.Router();

Router.post('/upload', collectFilesBeforeMulter(), optimizeImage(), upload.any(), uploadFile);

export default Router;
