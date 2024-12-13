import mongoose from 'mongoose';

const userFields = {
  createdBy: {
    default: 'System',
    immutable: true,
    type: mongoose.Schema.Types.Mixed
  },
  updatedBy: {
    default: 'System',
    type: mongoose.Schema.Types.Mixed
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
