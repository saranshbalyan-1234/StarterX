import pkg from 'jsonwebtoken';

import errorConstants from '#constants/error.constant.js';
import successConstants from '#constants/success.contant.js';
// import { createToken, getTokenError } from '#utils/jwt.js';
import sendMail from '#notification/Email/nodemailer.service.js';
import getError from '#utils/error.js';
import { getTenantDB } from '#utils/Mongo/mongo.connection.js';

import { loginWithCredentals } from '../Service/user.service.js';
const { verify } = pkg;

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const tenant = req.headers['x-tenant-id'] || process.env.DATABASE_NAME;
    const unverifiedUser = await req.models.unverified.create(
      [{ email, name, password, tenant }]
    );

    await sendMail({ _id: unverifiedUser[0]._id, email, name }, 'customerRegister');

    return res.status(200).json({
      message: 'Registered successfuly, Please check email to verify account.',
      user: unverifiedUser
    });
  } catch (error) {
    getError(error, res);
  }
};
const login = async (req, res) => {
  try {
    const { email, password, rememberMe = false } = req.body;

    const loggedInUser = await loginWithCredentals({ email, models: req.models, password, rememberMe, tenant: req.headers['x-tenant-id'] });
    return res.status(200).json(loggedInUser);
  } catch (error) {
    getError(error, res);
  }
};

const verifyCustomer = async (req, res) => {
  try {
    const data = verify(req.params.token, process.env.JWT_VERIFICATION_SECRET);

    console.log('Verifying User', data);

    try {
      const unverifiedUser = await req.models.unverified.findOneAndDelete({ _id: data._id }, { session: req.mongosession });
      if (!unverifiedUser) throw new Error(errorConstants.RECORD_NOT_FOUND);

      const { email, password, name, tenant } = unverifiedUser;

      const customer = await req.models.customer.findOneAndUpdate({ email },
        { $push: { tenant }, email, password },
        { new: true, session: req.mongosession, upsert: true }
      );

      const db = await getTenantDB(tenant);

      await db.models.user.create([{
        _id: customer._id,
        email,
        name,
        type: 'issuer'
      }]);

      return res.status(200).json({ message: successConstants.EMAIL_VERIFICATION_SUCCESSFULL });
    } catch (error) {
      getError(error, res);
    }
  } catch (error) {
    getError(error, res);
  }
};

const resendVerificationMail = async (req, res) => {
  try {
    const { email } = req.body;
    const unverifiedUser = await req.models.unverified.findOne({ email });
    if (!unverifiedUser) throw new Error(errorConstants.RECORD_NOT_FOUND);
    const { name, _id } = unverifiedUser;

    await sendMail({ _id, email, name }, 'customerRegister');
    return res.status(200).json({ message: 'Mail Sent!' });
  } catch (error) {
    getError(error, res);
  }
};

const sendResetPasswordMail = async (req, res) => {
  try {
    const { email } = req.body;
    const customer = await req.models.customer.findOne({ email });
    if (!customer) throw new Error(errorConstants.RECORD_NOT_FOUND);

    await sendMail({ _id: customer._id, email }, 'reset-password');

    return res.status(200).json({ email, message: 'Password rest mail sent.' });
  } catch (error) {
    getError(error, res);
  }
};

const resetPassword = async (req, res) => {
  try {
    const data = verify(req.params.token, process.env.JWT_RESET_SECRET);
    try {
      if (!req.body.password) throw new Error(errorConstants.INSUFFICIENT_DETAILS);
      const { _id } = data;

      const customer = await req.models.customer.findOneAndUpdate(
        { _id },
        { incorrectPasswordCount: 0, password: req.body.password },
        { new: true, session: req.mongosession });

      if (!customer) throw new Error(errorConstants.RECORD_NOT_FOUND);

      return res.status(200).json({ message: successConstants.PASSWORD_RESET_SUCCESSFULL });
    } catch (error) {
      getError(error, res);
    }
  } catch (error) {
    getError(error, res, 'Password Reset');
  }
};

/*
 *       // const refreshToken = (req, res) => {
 *
 *       /*
 *   try {
 *     const data = verify(req.params.token, process.env.JWT_REFRESH_SECRET);
 *     if (data) {
 *       const tokenData = { email: data.email, id: data.id };
 *       const accessToken = createToken(tokenData, process.env.JWT_ACCESS_SECRET, process.env.JWT_ACCESS_EXPIRATION);
 *       const refreshedToken = createToken(tokenData, process.env.JWT_REFRESH_SECRET, process.env.JWT_REFRESH_EXPIRATION);
 *       return res.status(200).json({ accessToken, refreshToken: refreshedToken });
 *     }
 *   } catch (e) {
 *     return res.status(401).json({ error: getTokenError(e, 'Refresh') });
 *   }
 * };
 */

export { login, register, resendVerificationMail, resetPassword, sendResetPasswordMail, verifyCustomer };
