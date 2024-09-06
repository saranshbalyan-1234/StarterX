import { Joi } from 'express-validation';

export const nameValidation = Joi.object({
  name: Joi.string().min(3).max(100).required()
});
export const idValidation = Joi.object({
  id: Joi.number().integer().required()
});

export const nameDesTagPrjValidation = Joi.object({
  description: Joi.string().allow(null, '').required(),
  name: Joi.string().min(3).max(100).required(),
  projectId: Joi.number().integer().required(),
  tags: Joi.array().allow(null, '')
});

export const createLogValidation = Joi.object({
  id: Joi.number().integer().required(),
  logs: Joi.array().required()
});
