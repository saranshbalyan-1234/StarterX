import nodemailer from 'nodemailer';

import { createToken } from '#utils/jwt.js';
import registerHTML from '#utils/Mail/HTML/register.js';
import resetPasswordHtml from '#utils/Mail/HTML/resetPassword.js';

const smtp = {
  auth: {
    pass: process.env.MAILER_PASS,
    user: process.env.MAILER_USER
  }
};
if (process.env.MAILER_SERVICE) {
  smtp.service = process.env.MAILER_SERVICE;
} else if (process.env.MAILER_HOST && process.env.MAILER_PORT) {
  smtp.host = process.env.MAILER_HOST;
  smtp.port = process.env.MAILER_PORT;
} else {
  console.error('Unable to connect to SMTP');
}
const transporter = nodemailer.createTransport(smtp);

const sendMailApi = (req, res) => {
  transporter.sendMail(req.body, (error, info) => {
    if (error) {
      return res.status(400).json({ error });
    }
    return res.status(200).json(info);
  });
};
const sendMail = (data, type) => {
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
          html: registerHTML(data.name, link),
          subject: 'Customer Registration Successfull',
          to: data.email
        };
        break;
      case 'reset-password':
        token = createToken({ _id: data._id }, process.env.JWT_RESET_SECRET, process.env.JWT_RESET_EXPIRATION);
        link = `${process.env.WEBSITE_HOME}/reset-password/${token}`;
        mailOption = {
          html: resetPasswordHtml(data.email, link),
          subject: 'Password Reset',
          to: data.email
        };
        break;
      default:
        break;
    }
    // await transporter.sendMail({ ...mailOption, from: process.env.MAILER_FROM });
    console.success('Mail send', mailOption);
    return true;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to send mail');
  }
};
export { sendMail, sendMailApi };
