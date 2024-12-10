import BaseController from '#utils/Mongo/BaseController.js';

const {
  deleteFromSchema: deleteRole,
  getAllFromSchema: getAllRole,
  getCreateOrUpdateFromSchema: getCreateOrUpdateRole
} = BaseController('roles');

export { deleteRole, getAllRole, getCreateOrUpdateRole };
