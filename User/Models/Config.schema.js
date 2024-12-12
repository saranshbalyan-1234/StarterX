import mongoose from 'mongoose';

import BaseSchema from '#utils/Mongo/BaseSchema.js';

const Config = BaseSchema({
  data: {
    required: 'Config data is required',
    trim: true,
    type: mongoose.Schema.Types.Mixed
  },
  name: {
    required: 'Config name is required',
    trim: true,
    type: String
  },
  tenant: {
    required: 'Tenant is required',
    trim: true,
    type: String
  }
});

export default Config;
