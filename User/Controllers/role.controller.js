import BaseController from '#utils/Mongo/BaseController.js';

const {
  deleteFromSchema: deleteRole,
  getAllFromSchema: getAllRole,
  getCreateOrUpdateFromSchema: getCreateOrUpdateRole
} = BaseController('role');

export { deleteRole, getAllRole, getCreateOrUpdateRole };
