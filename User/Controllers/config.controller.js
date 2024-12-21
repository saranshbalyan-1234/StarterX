import BaseController from '#utils/Mongo/BaseController.js';

const {
  getCreateOrUpdateFromSchema: createOrUpdateConfig,
  findOneFromSchema: findConfig,
  getAllFromSchema: getAllConfigs,
  deleteFromSchema: deleteConfig
} = BaseController('config');

export { createOrUpdateConfig, deleteConfig, findConfig, getAllConfigs };
