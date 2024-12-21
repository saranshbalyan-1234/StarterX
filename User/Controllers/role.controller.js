import BaseController from '#utils/Mongo/BaseController.js';

const {
  deleteOneFromSchema: deleteRole,
  findManyFromSchema: findManyRole,
  findOneFromSchema: findRole,
  createFromSchema: createRole,
  updateOneFromSchema: updateRole
} = BaseController('role');

export { createRole, deleteRole, findManyRole, findRole, updateRole };
