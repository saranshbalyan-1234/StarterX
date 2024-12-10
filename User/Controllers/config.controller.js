import BaseController from '#utils/Mongo/BaseController.js';

const {
  getCreateOrUpdateFromSchema: getCreateOrUpdateConfig
} = BaseController('config');

export { getCreateOrUpdateConfig };
