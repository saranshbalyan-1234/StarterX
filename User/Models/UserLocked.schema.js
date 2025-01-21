import mongoose from 'mongoose';

import BaseSchema from '#utils/Mongo/BaseSchema.js';

const UserLocked = BaseSchema({
  createdAt: { expires: 10, type: Date },
  customer: {
    default: null,
    ref: 'user',
    type: mongoose.Schema.Types.ObjectId
  }
});

export default UserLocked;
