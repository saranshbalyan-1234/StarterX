import _ from 'lodash';

import errorContstants from '#constants/error.constant.js';
import successContstants from '#constants/success.contant.js';
import getError from '#utils/error.js';
import { idValidation } from '#validations/index.js';

// Import { createJobManagerValidation } from "../Validations/scheduler.js";
import { getJobManagerFromMap, startManagerJobs, stopManager } from '../Service/schedulerService.js';
const db = {};
const JobManager = db.jobManagers;
const Job = db.jobs;

export const createJobManager = async (req, res) => {
  try {
    /*
     * Const { error } = createJobManagerValidation.validate(req.body);
     * if (error) throw new Error(error.details[0].message);
     */

    const projectId = req.headers['x-project-id'];
    const { active } = req.body;

    const jobManager = await JobManager.schema(req.database).create({ ...req.body, projectId });
    return res.status(200).json(jobManager);
  } catch (error) {
    getError(error, res);
  }
};

export const updateJobManagerById = async (req, res) => {
  try {
    const { jobManagerId } = req.params;
    const { error } = idValidation.validate({ id: jobManagerId });
    if (error) throw new Error(error.details[0].message);

    const prevJobManager = await JobManager.schema(req.database).findByPk(jobManagerId);
    if (!prevJobManager) return res.status(404).json({ error: errorContstants.RECORD_NOT_FOUND });
    const { name = prevJobManager.dataValues.name, active = prevJobManager.dataValues.active } = req.body;

    const payload = _.cloneDeep(req.body);

    if (active) {
      if (prevJobManager.dataValues.active === false) {
        console.log(`Starting Job Manager: ${prevJobManager.dataValues.id}`);
        const jobs = await Job.schema(req.database).findAll({ where: { jobManagerId } });
        await startManagerJobs({ active, jobs, name }, req.user.tenant, false);
      } else {
        console.log('Job Manager already active');
      }
    } else {
      console.log('Making Job Manager Inactive');
      if (prevJobManager.dataValues.active === true) {
        const oldJobManager = getJobManagerFromMap(`${req.user.tenant}_${prevJobManager.dataValues.id}`);
        if (oldJobManager) {
          stopManager(prevJobManager.dataValues.id, req.user.tenant);
          console.log('Job Manager Inactive Successfully');
        } else console.log('Job Manager Not Found');
      } else console.log('Job Manager Already Stopped');
    }

    const updatedJobManager = await JobManager.schema(req.database).update(payload, { where: { id: jobManagerId } });
    if (updatedJobManager.length > 0) {
      /*
       * Console.log(Updated Scheduler Maps")
       * console.log("Job Manager: ", jobManagerMap,")
       */
      return res.status(200).json({ message: successContstants.UPDATED });
    }
  } catch (error) {
    getError(error, res);
  }
};

export const getAllJobManager = async (req, res) => {
  try {
    const projectId = req.headers['x-project-id'];
    const jobManagers = await JobManager.schema(req.database).findAll({ where: { projectId } });
    return res.status(200).json(jobManagers);
  } catch (error) {
    getError(error, res);
  }
};

export const getJobManagerById = async (req, res) => {
  try {
    const { jobManagerId } = req.params;
    const jobManager = await JobManager.schema(req.database).findByPk(jobManagerId);
    return res.status(200).json(jobManager);
  } catch (error) {
    getError(error, res);
  }
};

export const removeJobManager = async (req, res) => {
  try {
    const { jobManagerId } = req.params;
    const { error } = idValidation.validate({ id: jobManagerId });
    if (error) throw new Error(error.details[0].message);

    const deletedJobManager = await JobManager.schema(req.database).destroy({
      where: { id: jobManagerId }
    });
    if (deletedJobManager > 0) return res.status(200).json({ message: successContstants.DELETED });
    return res.status(400).json({ error: errorContstants.RECORD_NOT_FOUND });
  } catch (error) {
    getError(error, res);
  }
};
