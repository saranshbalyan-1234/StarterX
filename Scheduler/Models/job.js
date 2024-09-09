import { Schema } from 'mongoose';

import BaseSchema from '#utils/Mongo/BaseSchema.js';

const Job = BaseSchema({
  active: {
    default: true,
    required: 'Active is required',
    type: Boolean
  },
  frequency: {
    required: 'Frequency is required',
    trim: true,
    type: String
  },
  jobManagerId: {
    ref: 'jobmanagers',
    required: 'JobManagerId is required',
    type: Schema.Types.ObjectId
  },
  name: {
    required: 'Name is required',
    trim: true,
    type: String
  },
  timeZone: {
    default: 'Asia/Kolkata',
    required: 'TimeZone is required',
    trim: true,
    type: String
  },
  url: {
    required: 'URL is required',
    trim: true,
    type: String
  }
});

export default Job;
