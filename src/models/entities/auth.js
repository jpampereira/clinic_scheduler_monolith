const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const ValidationError = require('../../errors/ValidationError');
const AuthorizationError = require('../../errors/AuthorizationError');

module.exports = class Auth {
  static validate(username, password) {
    if (!username) throw new ValidationError('Username attribute is mandatory');
    if (typeof username !== 'string') throw new ValidationError('Username attribute must be an string');

    if (!password) throw new ValidationError('Password attribute is mandatory');
    if (typeof password !== 'string') throw new ValidationError('Password attribute must be an string');
  }

  static validatePassword(inputPassword, storedHash) {
    return bcrypt.compareSync(inputPassword, storedHash);
  }

  static generateToken(userId, userRole) {
    const payload = {
      id: userId,
      role: userRole,
    };

    const tokenJwt = jwt.encode(payload, process.env.JWT_SECRET);
    const expiresAt = Date.now() + (1 * 60 * 60 * 1000); // hour * minute * second * milisecond

    return {
      token: tokenJwt,
      expiresAt,
      type: 'Bearer',
    };
  }

  static decodeToken(tokenJwt) {
    try {
      return jwt.decode(tokenJwt, process.env.JWT_SECRET);
    } catch (error) {
      throw new AuthorizationError('Invalid or expired token');
    }
  }
};
