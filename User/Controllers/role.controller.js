import mongoose from 'mongoose';

import getError from '#utils/error.js';
const getCreateOrUpdateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await req.models.roles.findOneAndUpdate(
      { _id: id || new mongoose.Types.ObjectId() },
      { ...req.body },
      { new: true, upsert: true });

    return res.status(200).json(role);
  } catch (error) {
    getError(error, res);
  }
};

const deleteRole = async (req, res) => {
  try {
    const role = await req.models.roles.findOneAndDelete({ _id: req.params.id });
    return res.status(200).json(role);
  } catch (error) {
    getError(error, res);
  }
};

const getAllRole = async (req, res) => {
  try {
    const roles = await req.models.roles.find();
    return res.status(200).json(roles);
  } catch (err) {
    getError(err, res);
  }
};

export { deleteRole, getAllRole, getCreateOrUpdateRole };
