import { Joi } from 'express-validation';

const addProjectValidation = Joi.object({
  description: Joi.string().allow(null, '').required(),
  endDate: Joi.string().required(),
  name: Joi.string().min(3).max(100).required(),
  startDate: Joi.string().required()
});
const updateProjectValidation = Joi.object({
  description: Joi.string().allow(null, '').required(),
  endDate: Joi.string(),
  name: Joi.string().min(3).max(100),
  projectId: Joi.number().integer().required(),
  startDate: Joi.string()
});

const memberProjectValidation = Joi.object({
  projectId: Joi.number().integer().required(),
  userId: Joi.number().integer().required()
});

export { addProjectValidation, memberProjectValidation, updateProjectValidation };
