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
  roles: [{ ref: 'roles', type: Schema.Types.ObjectId }],
  status: {
    default: 'active',
    enum: ['active', 'inactive', 'blocked'],
    lowercase: true,
    required: 'Status is required',
    trim: true,
    type: String
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
