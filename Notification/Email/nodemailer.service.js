import { createToken } from '#utils/jwt.js';

import { transporters } from './nodemailer.controller.js';
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
          subject: 'Customer Registration Successfull',
          text: link,
          to: data.email
        };
        break;
      case 'reset-password':
        token = createToken({ _id: data._id }, process.env.JWT_RESET_SECRET, process.env.JWT_RESET_EXPIRATION);
        link = `${process.env.WEBSITE_HOME}/reset-password/${token}`;
        mailOption = {
          subject: 'Password Reset',
          text: link,
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
export { sendMail };
