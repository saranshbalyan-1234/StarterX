import BaseController from '#utils/Mongo/BaseController.js';

const {
  deleteFromSchema: deleteRole,
  getAllFromSchema: getAllRole,
  createOrUpdateFromSchema: createOrUpdateRole,
  findOneFromSchema: findRole
} = BaseController('role');

export { createOrUpdateRole, deleteRole, findRole, getAllRole };
