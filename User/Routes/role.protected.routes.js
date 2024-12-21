import express from 'express';

// import { validate } from 'express-validation';
import { createOrUpdateRole, deleteRole, findRole, getAllRole } from '../Controllers/role.controller.js';
// import { emailBodyValidation, loginValidation, passwordBodyValidation, registerValidation, tokenParamsValidation } from '../Validations/auth.js';
const Router = express.Router();

Router.post('/', createOrUpdateRole);
Router.get('/', getAllRole);
Router.get('/:_id', findRole);
Router.delete('/:_id', deleteRole);

export default Router;
