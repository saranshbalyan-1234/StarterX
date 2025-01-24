import mongoose from 'mongoose';

import BaseSchema from '#utils/Mongo/BaseSchema.js';

const expireAfter = 10; //seconds

const UserLocked = BaseSchema({
  createdAt: { expires: expireAfter, type: Date },
  customer: {
    default: null,
    ref: 'user',
    type: mongoose.Schema.Types.ObjectId
  },
  unlockAt: {
    default: function calculateUnlockAt () {
      // Calculate unlockAt as createdAt + expireAfter
      return new Date(Date.now() + expireAfter * 1000);
    },
    type: Date
  }
});

export default UserLocked;
