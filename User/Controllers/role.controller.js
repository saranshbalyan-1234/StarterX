import BaseController from '#utils/Mongo/BaseController.js';

const roleController = new BaseController('role');

const {
  deleteOneFromSchema: deleteRole,
  findManyFromSchema: findManyRole,
  findOneFromSchema: findRole,
  createFromSchema: createRole,
  updateOneFromSchema: updateRole
} = roleController;

export { createRole, deleteRole, findManyRole, findRole, updateRole };
