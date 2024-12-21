import BaseController from '#utils/Mongo/BaseController.js';

const {
  createFromSchema: createConfig,
  updateOneFromSchema: updateConfig,
  findOneFromSchema: findConfig,
  findManyFromSchema: findManyConfig,
  deleteOneFromSchema: deleteConfig
} = BaseController('config');

export { createConfig, deleteConfig, findConfig, findManyConfig, updateConfig };
