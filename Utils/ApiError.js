class ApiError extends Error {
  constructor (message, statusCode, name) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    this.statusCode = statusCode || 400;
    this.name = name || this.constructor.name;
  }
}
global.ApiError = ApiError;
