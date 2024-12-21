import mongoose from 'mongoose';

const userFields = {
  createdBy: {
    default: null,
    immutable: true,
    ref: 'user',
    type: mongoose.Schema.Types.ObjectId
  },
  updatedBy: {
    default: null,
    ref: 'user',
    type: mongoose.Schema.Types.ObjectId
  }
};
const BaseSchema = (schemaDefinition, schemaOptions = {}) => {
  const isNestedField = !schemaOptions.nestedField;
  delete schemaOptions.nestedField;
  return new mongoose.Schema(
    {
      ...schemaDefinition,
      ...(isNestedField === false ? {} : userFields)
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
