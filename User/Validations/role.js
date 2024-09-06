import { Joi } from 'express-validation';

const updateNameValidation = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  roleId: Joi.number().integer().required()
});
const updatePermissionValidation = Joi.object({
  add: Joi.boolean().required(),
  delete: Joi.boolean().required(),
  edit: Joi.boolean().required(),
  name: Joi.string().min(3).max(100).required(),
  view: Joi.boolean().required()
});

export { updateNameValidation, updatePermissionValidation };
