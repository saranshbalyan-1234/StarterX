import express from 'express';
import { uploadFile } from './storage.controller.js';
import { optimizeImage,collectFilesBeforeMulter } from './compress.middlewre.js'
const Router = express.Router();

Router.post('/upload', collectFilesBeforeMulter(), optimizeImage(), upload.any(), uploadFile);

export default Router;
