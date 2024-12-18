import mongoose from 'mongoose';

const userFields = {
  createdBy: {
    default: null,
    immutable: true,
    ref: 'users',
    type: mongoose.Schema.Types.ObjectId
  },
  updatedBy: {
    default: null,
    ref: 'user',
    type: mongoose.Schema.Types.ObjectId
  }
};
const BaseSchema = (schemaDefinition, schemaOptions = {}) => {
  const isUserFields = schemaOptions.userFields;
  delete schemaOptions.userFields;
  return new mongoose.Schema(
    {
      ...schemaDefinition,
      ...(isUserFields === false ? {} : userFields)
    },
    {
      optimisticConcurrency: true,
      strict: 'throw',
      timestamps: true,
      ...schemaOptions
    }
  );
};
export default BaseSchema;
