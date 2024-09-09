import errorContstants from '#constants/error.constant.js';
import successContstants from '#constants/success.contant.js';
import getError from '#utils/error.js';
import { idValidation } from '#validations/index.js';

import { addJob, getJobManagerFromMap, updateJobStatus } from '../Service/schedulerService.js';
const db = {};
const Job = db.jobs;
const JobManager = db.jobManagers;
export const createJob = async (req, res) => {
  try {
    /*
     * Const { error } = createJobValidataion.validate(req.body);
     * if (error) throw new Error(error.details[0].message);
     */

    const { jobManagerId } = req.body;
    const job = await Job.schema(req.database).create({ ...req.body });
    await addJob(jobManagerId, job, req.user.tenant);
    return res.status(200).json(job);
  } catch (error) {
    getError(error, res);
  }
};

export const updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { error } = idValidation.validate({ id: jobId });
    if (error) throw new Error(error.details[0].message);

    const job = await Job.schema(req.database).findOne({ where: { id: jobId } });
    if (!job) return res.status(404).json({ error: errorContstants.RECORD_NOT_FOUND });

    const updatedJob = await Job.schema(req.database).update({ ...req.body }, { where: { id: jobId } });
    if (Object.hasOwn(req.body, 'active')) updateJobStatus(job.jobManagerId, jobId, req.body.active, req.user.tenant);

    if (updatedJob.length > 0) return res.status(200).json({ message: successContstants.UPDATED });
  } catch (error) {
    getError(error, res);
  }
};

export const getAllJobByJobManagerId = async (req, res) => {
  try {
    const { jobManagerId } = req.params;
    const jobs = await Job.schema(req.database).findAll({ where: { jobManagerId } });
    return res.status(200).json(jobs);
  } catch (error) {
    getError(error, res);
  }
};

export const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.schema(req.database).findByPk(jobId);
    return res.status(200).json(job);
  } catch (error) {
    getError(error, res);
  }
};

export const removeJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const manager = await JobManager.findOne({ where: { jobId } });

    const jobManager = getJobManagerFromMap(`${req.user.tenant}_${manager.id}`);
    await jobManager.stop(String(jobId));
    const { error } = idValidation.validate({ id: jobId });
    if (error) throw new Error(error.details[0].message);

    const deletedJob = await Job.schema(req.database).destroy({
      where: { id: jobId }
    });
    if (deletedJob > 0) return res.status(200).json({ message: successContstants.DELETED });
    return res.status(400).json({ error: errorContstants.RECORD_NOT_FOUND });
  } catch (error) {
    getError(error, res);
  }
};
