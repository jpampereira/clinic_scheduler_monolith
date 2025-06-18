module.exports = class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthorizationError';
    this.httpStatus = 401;
  }
};
