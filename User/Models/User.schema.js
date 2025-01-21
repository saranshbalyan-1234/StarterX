import { Schema } from 'mongoose';

import BaseSchema from '#utils/Mongo/BaseSchema.js';

const User = BaseSchema({
  defaultProjectId: {
    type: Number
  },
  email: {
    immutable: true,
    lowercase: true,
    match: [/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/, 'Enter valid email address'],
    required: 'Email address is required',
    trim: true,
    type: String,
    unique: true
  },
  name: {
    lowercase: true,
    required: 'Name is required',
    trim: true,
    type: String
  },
  profileImage: {
    type: String
  },
  roles: [{ ref: 'role', type: Schema.Types.ObjectId }],
  active: {
    default: true,
    required: 'Active Status is required',
    type: Boolean
  },
  type: {
    default: 'user',
    enum: ['user', 'admin', 'issuer'],
    lowercase: true,
    required: 'Type is required',
    trim: true,
    type: String
  }
});

export default User;
