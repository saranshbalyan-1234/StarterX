import express from 'express';

// import { validate } from 'express-validation';
import { deleteRole, getAllRole, getCreateOrUpdateRole } from '../Controllers/role.controller.js';
// import { emailBodyValidation, loginValidation, passwordBodyValidation, registerValidation, tokenParamsValidation } from '../Validations/auth.js';
const Router = express.Router();

Router.post('/', getCreateOrUpdateRole);
Router.get('/', getAllRole);
Router.delete('/:id', deleteRole);

export default Router;
