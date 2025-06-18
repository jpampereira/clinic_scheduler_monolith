const AuthEntity = require('../entities/auth');
const AuthorizationError = require('../../errors/AuthorizationError');

module.exports = class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  static build(userRepository) {
    return new AuthService(userRepository);
  }

  async authenticate(username, password) {
    AuthEntity.validate(username, password);

    const userByMail = await this.userRepository.list({ mail: username });
    const userByCpf = await this.userRepository.list({ cpf: username });
    const [user] = [].concat(userByMail).concat(userByCpf);

    if (!user || !user.status || !AuthEntity.validatePassword(password, user.password)) {
      throw new AuthorizationError('Invalid username or password');
    }

    const output = AuthEntity.generateToken(user.id, user.role);

    return output;
  }
};
