import { Schema } from 'mongoose';

import BaseSchema from '#utils/Mongo/BaseSchema.js';

const JobManagerSchema = BaseSchema({
  active: {
    default: true,
    required: 'Active is required',
    type: Boolean
  },
  name: {
    required: 'Name is required',
    trim: true,
    type: String
  },
  projectId: {
    ref: 'projects',
    required: 'ProjectId Status is required',
    type: Schema.Types.ObjectId
  }
});

export default JobManagerSchema;
