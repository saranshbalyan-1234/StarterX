import { Joi } from 'express-validation';

const createJobManagerValidation = Joi.object({
  active: Joi.boolean(),
  connection: Joi.object().allow(null, ''),
  name: Joi.string().min(1).max(10).required()
});

const createJobValidataion = Joi.object({
  active: Joi.boolean(),
  data: Joi.object().allow(null, ''),
  jobManagerId: Joi.number().integer().required(),
  name: Joi.string().min(1).max(10).required(),
  time: Joi.string().required(),
  timezone: Joi.string(),
  type: Joi.string().required()
});

export { createJobManagerValidation, createJobValidataion };
