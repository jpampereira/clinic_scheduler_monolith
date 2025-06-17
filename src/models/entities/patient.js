const uuid = require('uuid-random');
const User = require('./user');

module.exports = class Patient extends User {
  static build(name, cpf, birthdate, mail, phone, password) {
    return new Patient(
      uuid(),
      name,
      cpf,
      birthdate,
      mail,
      phone,
      password,
      'Patient',
      true,
    );
  }

  static with(id, name, cpf, birthdate, mail, phone, password, status) {
    return new Patient(
      id,
      name,
      cpf,
      birthdate,
      mail,
      phone,
      password,
      'Patient',
      status,
    );
  }
};
