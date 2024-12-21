import express from 'express';

// import { validate } from 'express-validation';
import { createRole, deleteRole, findManyRole, findRole, updateRole } from '../Controllers/role.controller.js';
// import { emailBodyValidation, loginValidation, passwordBodyValidation, registerValidation, tokenParamsValidation } from '../Validations/auth.js';
const Router = express.Router();

Router.post('/', createRole);
Router.put('/:_id', updateRole);
Router.get('/', findManyRole);
Router.get('/:_id', findRole);
Router.delete('/:_id', deleteRole);

export default Router;
