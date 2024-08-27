import BaseSchema from '#utils/Mongo/BaseSchema.js';

const Unverified = BaseSchema({
  email: {
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
  password: {
    required: 'Password is required',
    trim: true,
    type: String
  },
  tenant: {
    required: 'tenant is required',
    trim: true,
    type: String
  }
});

export default Unverified;
