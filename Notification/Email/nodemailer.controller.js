import nodemailer from 'nodemailer';

import getError from '#utils/error.js';

export const transporters = {};

const sendMailApi = async (req, res) => {
  try {
    const tenant = req.headers['x-tenant-id'];
    const transporter = transporters[tenant];

    if (!transporter) {
      const mailConfig = await req.models.config.findOne({ type: 'mailer' });
      if (!mailConfig) throw new Error('No SMTP found!', 404);
      if (mailConfig.cache) transporters[tenant] = nodemailer.createTransport(mailConfig);
    }

    transporter.sendMail(req.body, (error, info) => {
      if (error) {
        return res.status(400).json({ error });
      }
      return res.status(200).json(info);
    });
  } catch (err) {
    getError(err, res);
  }
};

export { sendMailApi };
