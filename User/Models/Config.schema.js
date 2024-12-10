import { Schema } from 'mongoose';

import BaseSchema from '#utils/Mongo/BaseSchema.js';

const Config = BaseSchema({
  user: {
    ref: 'users',
    type: Schema.Types.ObjectId
  }
});

export default Config;
