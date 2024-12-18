import mongoose from 'mongoose';

const userFields = {
  createdBy: {
    ref: 'users',
    default: null,
    immutable: true,
    type: mongoose.Schema.Types.ObjectId
  },
  updatedBy: {
    ref: 'user',
    default: null,
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
