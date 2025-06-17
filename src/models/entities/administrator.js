const uuid = require('uuid-random');
const User = require('./user');

module.exports = class Administrator extends User {
  static build(name, cpf, birthdate, mail, phone, password) {
    return new Administrator(
      uuid(),
      name,
      cpf,
      birthdate,
      mail,
      phone,
      password,
      'Administrator',
      false,
    );
  }

  static with(id, name, cpf, birthdate, mail, phone, password, status) {
    return new Administrator(
      id,
      name,
      cpf,
      birthdate,
      mail,
      phone,
      password,
      'Administrator',
      status,
    );
  }
};
