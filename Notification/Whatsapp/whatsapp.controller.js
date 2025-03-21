import getError from '#utils/error.js';

import sock from './whatsapp.service.js';

const sendWhatsappMsgApi = async (req, res) => {
  try {
    const { recipient, text } = req.body;
    const info = await sock.sendMessage(recipient, { text });
    return res.status(200).json(info);
  } catch (err) {
    getError(err, res);
  }
};

export { sendWhatsappMsgApi };
