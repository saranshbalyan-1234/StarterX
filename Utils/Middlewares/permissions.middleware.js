import errorContstants from '#constants/error.constant.js';
import getError from '#utils/error.js';
import { idValidation } from '#validations/index.js';

const validatePermission = (permissionName, method) => async (req, res, next) => {
  try {
    if (!(req.user.type === 'issuer' || req.user.type === 'admin')) {
      const allowed = await req.user.permissions.some((permission) => permissionName === permission.name && permission[method] === true);
      if (!allowed) throw new Error(errorContstants.UNAUTHORIZED, 403, 'Permission');
    }
    return next();
  } catch (e) {
    return getError(e, res);
  }
};

const validateSuperAdmin = () => (req, res, next) => {
  try {
    if (!req.user.superAdmin) throw new Error(errorContstants.UNAUTHORIZED, 403, 'Permission');
    return next();
  } catch (e) {
    return getError(e, res);
  }
};
const validateIssuer = () => (req, res, next) => {
  try {
    if (!req.user.type === 'issuer') throw new Error(errorContstants.UNAUTHORIZED, 403, 'Permission');
    return next();
  } catch (e) {
    return getError(e, res);
  }
};

const validateUserProject = () => (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.headers['x-project-id'];
    const { error } = idValidation.validate({ id: projectId });
    if (error) throw new Error(error.details[0].message);

    /*
     * const userProject = await UserProject.schema(req.database).findOne({
     *   where: { projectId, userId: req.user.id }
     * });
     * if (!userProject) throw new Error(errorContstants.UNAUTHORIZED,403,"Permission");
     */

    return next();
  } catch (e) {
    return getError(e, res);
  }
};

export { validateIssuer, validatePermission, validateSuperAdmin, validateUserProject };
