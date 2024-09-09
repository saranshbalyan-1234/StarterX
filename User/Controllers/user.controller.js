// import successConstants from '#constants/success.contant.js';

/*
 * import { s3, uploadFile } from '#storage/Service/awsService.js';
 */
import cache from '#utils/Cache/index.js';
import { getTenantDB } from '#utils/Mongo/mongo.connection.js';
import getError from '#utils/error.js';
// import { deleteCustomer } from '../Service/database.service.js';

const getOrUpdateUser = async (req, res) => {
  try {
    const body = { ...req.body };
    delete body.status;
    delete body.type;

    const { password } = body;
    if (password) {
      const db = await getTenantDB();
      await db.models.customer.findOneAndUpdate(
        { _id: req.body._id },
        { password }
      );
    }

    const user = await req.models.user.findOneAndUpdate(
      { _id: req.body._id },
      { ...req.body },
      { new: true });

    return res.status(200).json(user);
  } catch (error) {
    getError(error, res);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await req.models.user.find();
    return res.status(200).json(users);
  } catch (error) {
    getError(error, res);
  }
};

const logout = (req, res) => {
  try {
    if (process.env.JWT_ACCESS_CACHE) cache.del(`accesstoken_${req.user.email}`);
    return res.status(200).json({ message: 'Logout Successfull' });
  } catch (error) {
    getError(error, res);
  }
};

// const deleteUser = async (req, res) => {

/*
 *   try {
 *     const { userId } = req.params;
 */

/*
 *     const user = await User.schema(req.database).findByPk(userId);
 *     if (req.user.tenant === user.email.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase()) throw new Error('Cannot Delete Customer Admin');
 *     await userProject.schema(req.database).destroy({ where: { userId } });
 *     await UserRole.schema(req.database).destroy({ where: { userId } });
 *     const deletedUser = await User.schema(req.database).destroy({
 *       where: {
 *         id: userId
 *       }
 *     });
 *     if (deletedUser > 0) {
 *       const deletedCustomerUser = await Customer.schema(process.env.DATABASE_PREFIX + process.env.DATABASE_NAME).destroy({
 *         where: {
 *           email: user.email
 *         }
 *       });
 *       if (deletedCustomerUser > 0) {
 *         return res.status(200).json({ message: 'User Deleted Successfully' });
 *       }
 *     } else {
 *       throw new Error('User Not Found');
 *     }
 *   } catch (error) {
 *     getError(error, res);
 *   }
 * };
 */

// const deleteCustomerUser = async (req, res) => {

/*
 *   try {
 *     if (!req.user.customerAdmin) throw new Error(errorContstants.UNAUTHORIZED);
 */

/*
 *     await deleteCustomer(req.user.email);
 *     return res.status(200).json({ message: 'Deleted all data!' });
 *   } catch (error) {
 *     getError(error, res);
 *   }
 * };
 */

// const uploadProfileImage = async (req, res) => {

/*
 *   try {
 *     const file = req.files.image;
 *     if (!file) throw new Error('Inavlid Image');
 *     const bucketName = req.database.split('_')[1].toLowerCase();
 *     const fileName = req.user.email.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase();
 *     const result = await uploadFile(file, bucketName, fileName);
 *     if (result) {
 *       await User.schema(req.database).update(
 *         { profileImage: true },
 *         {
 *           where: {
 *             id: req.user.id
 *           }
 *         }
 *       );
 *       return res.status(200).json({ message: successConstants.UPDATED });
 *     }
 *     throw new Error('Unable to upload profile image!');
 *   } catch (error) {
 *     getError(error, res);
 *   }
 * };
 */

export { getAllUsers, getOrUpdateUser, logout };
