import express from 'express';
import upload from './multer.service.js';
import { optimizeImage } from './compress.middleware.js';
import { uploadFile } from './storage.controller.js';

const Router = express.Router();

// Correct Middleware Order: Upload First → Optimize Second
Router.post('/upload', upload.any(), optimizeImage, uploadFile);

export default Router;