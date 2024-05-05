import BaseSchema from '#utils/Mongo/BaseSchema.js';

const permissionsSchema = BaseSchema({
  add: {
    default: false,
    required: 'Add Permission is required',
    type: Boolean
  },
  delete: {
    default: false,
    required: 'delete Permission is required',
    type: Boolean
  },
  edit: {
    default: false,
    required: 'Edit Permission is required',
    type: Boolean
  },
  name: {
    required: 'Permission name is required',
    trim: true,
    type: String
  },
  view: {
    default: false,
    required: 'View Permission is required',
    type: Boolean
  }
}, { _id: false });

const Roles = BaseSchema({
  name: {
    lowercase: true,
    required: 'Role is required',
    trim: true,
    type: String
  },
  permissions: [permissionsSchema]
});

export default Roles;
