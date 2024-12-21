import getError from '#utils/error.js';

const BaseController = (schema) => {
  const createFromSchema = async (req, res) => {
    try {
      const result = await req.models[schema].create(req.body);
      return res.status(200).json(result);
    } catch (err) {
      getError(err, res);
    }
  };

  const deleteManyFromSchema = async (req, res) => {
    try {
      const result = await req.models[schema].deleteMany(req.params);
      return res.status(200).json(result);
    } catch (error) {
      getError(error, res);
    }
  };

  const deleteOneFromSchema = async (req, res) => {
    try {
      const result = await req.models[schema].deleteOne(req.params);
      return res.status(200).json(result);
    } catch (error) {
      getError(error, res);
    }
  };

  const findManyFromSchema = async (req, res) => {
    try {
      const result = await req.models[schema].find(req.params);
      return res.status(200).json(result);
    } catch (err) {
      getError(err, res);
    }
  };

  const findOneFromSchema = async (req, res) => {
    try {
      const result = await req.models[schema].findOne(req.params);
      return res.status(200).json(result);
    } catch (err) {
      getError(err, res);
    }
  };

  const updateManyFromSchema = async (req, res) => {
    try {
      const result = await req.models[schema].updateMany(req.params, req.body);
      return res.status(200).json(result);
    } catch (err) {
      getError(err, res);
    }
  };

  const updateOneFromSchema = async (req, res) => {
    try {
      const result = await req.models[schema].updateOne(req.params, req.body);
      return res.status(200).json(result);
    } catch (err) {
      getError(err, res);
    }
  };

  return {
    createFromSchema,
    deleteManyFromSchema,
    deleteOneFromSchema,
    findManyFromSchema,
    findOneFromSchema,
    updateManyFromSchema,
    updateOneFromSchema
  };
};

export default BaseController;
