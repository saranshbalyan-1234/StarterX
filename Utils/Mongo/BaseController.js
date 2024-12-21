import mongoose from 'mongoose';

import getError from '#utils/error.js';

const BaseController = (schema) => {
  const createOrUpdateFromSchema = async (req, res) => {
    try {
      const body = req.body;
      const id = body._id || new mongoose.Types.ObjectId();
      const shouldUpdateMeta = Object.keys(body).length > 2;

      const result = await req.models[schema].findOneAndUpdate(
        { _id: id },
        shouldUpdateMeta ? { ...body } : {},
        { new: true, upsert: true });

      return res.status(200).json(result);
    } catch (error) {
      getError(error, res);
    }
  };

  const deleteFromSchema = async (req, res) => {
    try {
      const body = { ...req.body };
      delete body.createdBy;
      delete body.updatedBy;

      if (Object.keys(body || {}).length === 0) throw new Error('Insufficient conditions');

      const result = await req.models[schema].findOneAndDelete(body);
      return res.status(200).json(result);
    } catch (error) {
      getError(error, res);
    }
  };

  const getAllFromSchema = async (req, res) => {
    try {
      const result = await req.models[schema].find({ ...req.body || {} });
      return res.status(200).json(result);
    } catch (err) {
      getError(err, res);
    }
  };

  const findOneFromSchema = async (req, res) => {
    try {
      const result = await req.models[schema].findOne({ ...req.params || {} });
      return res.status(200).json(result);
    } catch (err) {
      getError(err, res);
    }
  };

  return { createOrUpdateFromSchema, deleteFromSchema, findOneFromSchema, getAllFromSchema };
};

export default BaseController;
