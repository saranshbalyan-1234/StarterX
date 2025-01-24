import BaseController from '#utils/Mongo/BaseController.js';

const configController = new BaseController('config');

const {
  createFromSchema: createConfig,
  updateOneFromSchema: updateConfig,
  findOneFromSchema: findConfig,
  findManyFromSchema: findManyConfig,
  deleteOneFromSchema: deleteConfig
} = configController;

export { createConfig, deleteConfig, findConfig, findManyConfig, updateConfig };
