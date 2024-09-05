class ApiError extends Error {
  constructor (message, statusCode) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    this.statusCode = statusCode;
  }
}
global.ApiError = ApiError;
