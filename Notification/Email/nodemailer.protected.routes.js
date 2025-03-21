import express from 'express';

import { sendMailApi } from './nodemailer.controller.js';
const Router = express.Router();

Router.post('/send-mail', sendMailApi);

export default Router;
