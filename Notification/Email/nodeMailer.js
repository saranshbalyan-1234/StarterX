import nodemailer from 'nodemailer';

import getError from '#utils/error.js';
import { createToken } from '#utils/jwt.js';

const transporters = {

};

const sendMailApi = async (req, res) => {
  try {
    const tenant = req.headers['x-tenant-id'];
    const transporter = transporters[tenant];

    if (!transporter) {
      const mailConfig = await req.models.config.findOne({ type: 'mailer' });
      if (!mailConfig) throw new Error('No SMTP found!', 404);
      if(mailConfig.cache) transporters[tenant] = nodemailer.createTransport(mailConfig);
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
const sendMail = async (data, type, tenant) => {
  try {
    let mailOption = {
      html: '',
      subject: '',
      text: '',
      to: ''
    };
    let token = '';
    let link = '';
    switch (type) {
      case 'customerRegister':
        token = createToken({ _id: data._id }, process.env.JWT_VERIFICATION_SECRET);
        link = `${process.env.WEBSITE_HOME}/auth/verify-customer/${token}`;
        mailOption = {
          text: link,
          subject: 'Customer Registration Successfull',
          to: data.email
        };
        break;
      case 'reset-password':
        token = createToken({ _id: data._id }, process.env.JWT_RESET_SECRET, process.env.JWT_RESET_EXPIRATION);
        link = `${process.env.WEBSITE_HOME}/reset-password/${token}`;
        mailOption = {
          text: link,
          subject: 'Password Reset',
          to: data.email
        };
        break;
      default:
        break;
    }
      const transporter = transporters[tenant];
    await transporter.sendMail({ ...mailOption, from: process.env.MAILER_FROM });
    console.success('Mail send', mailOption);
    return true;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to send mail');
  }
};
export { sendMail, sendMailApi };
