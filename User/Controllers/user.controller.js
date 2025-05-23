import cache from '#utils/cache.js';
import getError from '#utils/error.js';
import { getTenantDB } from '#utils/Mongo/mongo.connection.js';

const getOrUpdateUser = async (req, res) => {
  try {
    const body = { ...req.body };

    const { password } = body;
    const { id } = req.params;
    if (password) {
      const db = await getTenantDB();
      await db.models.customer.findOneAndUpdate(
        { _id: id },
        { password }
      );
    }

    const user = await req.models.user.findOneAndUpdate(
      { _id: id },
      { ...body },
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

export { getAllUsers, getOrUpdateUser, logout };
