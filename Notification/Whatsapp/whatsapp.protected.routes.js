import express from 'express';

import { sendWhatsappMsgApi } from './whatsapp.controller.js';
const Router = express.Router();

Router.post('/send-whatsapp-msg', sendWhatsappMsgApi);

export default Router;
