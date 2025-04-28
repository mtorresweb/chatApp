class ApiError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends ApiError {
  constructor(path) {
    super(`The requested path ${path} was not found!`, 404);
  }
}

module.exports = NotFoundError;
