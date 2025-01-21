import BaseSchema from '#utils/Mongo/BaseSchema.js';

const customerSchema = BaseSchema({
  blocked: {
    default: false,
    required: 'Blocked Status is required',
    type: Boolean
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
  incorrectPasswordCount: {
    default: 0,
    type: Number
  },
  lastLogin: {
    type: Date
  },
  password: {
    required: 'Password is required',
    trim: true,
    type: String
  },
  superAdmin: {
    default: false,
    immutable: true,
    required: 'SuperAdmin is required',
    type: Boolean
  },
  tenant: {
    required: 'tenant is required',
    type: Array
  }
});

export default customerSchema;
