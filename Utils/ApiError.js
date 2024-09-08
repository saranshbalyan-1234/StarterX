class ApiError extends Error {
  constructor (message, statusCode, customName) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    this.statusCode = statusCode || 400;
    this.customName = customName || this.constructor.name;
  }
}
global.Error = ApiError;
