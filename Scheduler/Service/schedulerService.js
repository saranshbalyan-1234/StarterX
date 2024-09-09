// Import Scheduler from 'cron-job-manager';

import { getAllTenant } from '#user/Controllers/superAdmin.controller.js';

const db = {};
const JobManager = db.jobManagers;
const Job = db.jobs;

export const jobManagerMap = {};

const skipTenant = ['demo@yopmail.com', 'saransh2yopmailcom'];

export const scheduleInit = async () => {
  console.log('Scheduler Initialized');
  try {
    const customers = [...(await getAllTenant()), { tenantName: 'master' }];
    for (let i = 0; i < customers.length; i++) {
      const customer = customers[i];
      if (skipTenant.includes(customer.tenantName)) continue;
      const jobManagers = await JobManager.schema(process.env.DATABASE_PREFIX + customer.tenantName).findAll({
        include: [{ model: Job.schema(process.env.DATABASE_PREFIX + customer.tenantName) }]
      });

      for (let j = 0; j < jobManagers.length; j++) {
        const manager = jobManagers[j];
        await startManagerJobs(manager, customer.tenantName);
      }
    }
    console.log('Current Jobs', jobManagerMap);
  } catch (e) {
    console.error(e);
  }
};

export const startManagerJobs = async (manager, tenant) => {
  try {
    console.log('Starting Manager Active Jobs: ', manager.name);
    if (!manager.active) return console.log('Cannot Start Inactive Manager');
    manager.jobs?.forEach((job) => {
      addJob(manager.id, job, tenant);
    });
  } catch (err) {
    console.error(err);
  }
};

export const stopManager = async (managerId, tenant) => {
  try {
    const manager = jobManagerMap[`${tenant}_${managerId}`];
    await manager.stopAll();
    delete jobManagerMap[`${tenant}_${managerId}`];
  } catch (err) {
    console.error(err);
  }
};

export const addJob = async (managerId, job, tenant) => {
  try {
    const manager = jobManagerMap[`${tenant}_${managerId}`];

    return await manager.add(
      String(job.id),
      job.time,
      () => {
        console.log('Job Triggered:', job.name);
      },
      {
        onComplete: () => {
          console.log('Job Stopped:', job.name);
        },
        start: job.active,
        timeZone: job.timezone
      }
    );
  } catch (err) {
    console.error(err);
  }
};


export const getJobManagerFromMap = (key) => {
  try {
    return jobManagerMap[key];
  } catch (err) {
    console.error(err);
  }
};

export const updateJobStatus = (managerId, jobId, status, tenant) => {
  if (status !== true && status !== false) return console.log('Invalid Job Status');
  console.log(`Updating Job with key ${jobId} status to ${status}:`);
  try {
    const manager = jobManagerMap[`${tenant}_${managerId}`];
    if (status === true) {
      manager.start(String(jobId));
    } else if (status === false) {
      manager.stop(String(jobId));
    }
  } catch (err) {
    console.error(err);
  }
};
