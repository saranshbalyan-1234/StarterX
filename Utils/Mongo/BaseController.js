import mongoose from 'mongoose';

import getError from '#utils/error.js';

const BaseController = (schema) => {
  const getCreateOrUpdateFromSchema = async (req, res) => {
    try {
      const { id } = req.body;
      const result = await req.models[schema].findOneAndUpdate(
        { _id: id || new mongoose.Types.ObjectId() },
        { ...req.body },
        { new: true, upsert: true });

      return res.status(200).json(result);
    } catch (error) {
      getError(error, res);
    }
  };

  const deleteFromSchema = async (req, res) => {
    try {
      const { id } = req.body;
      const result = await req.models[schema].findOneAndDelete({ _id: id });
      return res.status(200).json(result);
    } catch (error) {
      getError(error, res);
    }
  };

  const getAllFromSchema = async (req, res) => {
    try {
      const result = await req.models[schema].find();
      return res.status(200).json(result);
    } catch (err) {
      getError(err, res);
    }
  };

  return { deleteFromSchema, getAllFromSchema, getCreateOrUpdateFromSchema };
};

export default BaseController;
