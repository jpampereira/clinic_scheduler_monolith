const uuid = require('uuid-random');
const ValidationError = require('../../errors/ValidationError');
const encryptPassword = require('../../utils/hashGenerator');

module.exports = class User {
  constructor(id, name, cpf, birthdate, mail, phone, password, profile, status) {
    this.id = id;
    this.name = name;
    this.cpf = cpf;
    this.birthdate = birthdate;
    this.mail = mail;
    this.phone = phone;
    this.password = password;
    this.profile = profile;
    this.status = status;
  }

  static build(name, cpf, birthdate, mail, phone, password, profile) {
    return new User(
      uuid(),
      name,
      cpf,
      birthdate,
      mail,
      phone,
      password,
      profile,
      false,
    );
  }

  static with(id, name, cpf, birthdate, mail, phone, password, profile, status) {
    return new User(
      id,
      name,
      cpf,
      birthdate,
      mail,
      phone,
      password,
      profile,
      status,
    );
  }

  validate() {
    this.validateName();
    this.validateCpf();
    this.validateBirthdate();
    this.validateMail();
    this.validatePhone();
    this.validateProfile();
    this.validatePassword();
    this.validateStatus();
  }

  validateName() {
    if (!this.name) throw new ValidationError('Name attribute is mandatory');
    if (typeof this.name !== 'string') throw new ValidationError('Name attribute must be an string');
  }

  validateCpf() {
    if (!this.cpf) throw new ValidationError('Cpf attribute is mandatory');
    if (typeof this.cpf !== 'string') throw new ValidationError('Cpf attribute must be an string');
    if (!this.cpf.match(/^\d{11}$/)) throw new ValidationError('Cpf attribute must be in format of 11 digits without non-number characters');

    let sum;

    sum = 0;

    for (let i = 0; i < 9; i += 1) {
      sum += parseInt(this.cpf[i], 10) * (10 - i);
    }

    const firstDigit = `${(sum % 11) < 2 ? 0 : 11 - (sum % 11)}`;

    sum = 0;

    for (let i = 0; i < 9; i += 1) {
      sum += parseInt(this.cpf[i], 10) * (11 - i);
    }

    sum += parseInt(firstDigit, 10) * 2;

    const secondDigit = `${(sum % 11) < 2 ? 0 : 11 - (sum % 11)}`;

    if (this.cpf[9] !== firstDigit || this.cpf[10] !== secondDigit) throw new ValidationError('Cpf attribute is invalid');
  }

  validateBirthdate() {
    if (!this.birthdate) throw new ValidationError('Birthdate attribute is mandatory');
    if (typeof this.birthdate !== 'string') throw new ValidationError('Birthdate attribute must be an string');
    if (!this.birthdate.match(/^\d{4}-\d{2}-\d{2}$/)) throw new ValidationError('Birthdate attribute must be in format YYYY-MM-DD');

    const birthdate = new Date(this.birthdate);
    const now = new Date();

    if (Number.isNaN(birthdate.getDate())) throw new ValidationError('Birthdate attribute is invalid');
    if (birthdate > now) throw new ValidationError('Birthdate attribute value did not happened yet');
  }

  validateMail() {
    if (!this.mail) throw new ValidationError('Mail attribute is mandatory');
    if (typeof this.mail !== 'string') throw new ValidationError('Mail attribute must be an string');
    if (!this.mail.match(/^\S+@[A-Za-z]+\.com(\.[A-Za-z]+)?$/)) throw new ValidationError('Mail attribute must be in format username@domain.com');
  }

  validatePhone() {
    if (!this.phone) throw new ValidationError('Phone attribute is mandatory');
    if (typeof this.phone !== 'string') throw new ValidationError('Phone attribute must be an string');
    if (!this.phone.match(/^\d{11}$/)) throw new ValidationError('Phone attribute must be in format DDD+9 digits');
  }

  validateProfile() {
    if (!this.profile) throw new ValidationError('Profile attribute is mandatory');
    if (typeof this.profile !== 'string') throw new ValidationError('Profile attribute must be an string');
    if (this.profile !== 'Administrator' && this.profile !== 'Patient' && this.profile !== 'Doctor') throw new ValidationError('Profile attribute must be \'Administrator\', \'Patient\' or \'Doctor\'');
  }

  validatePassword() {
    if (!this.password) throw new ValidationError('Password attribute is mandatory');
    if (typeof this.password !== 'string') throw new ValidationError('Password attribute must be an string');
  }

  validateStatus() {
    if (this.status === undefined || this.status === null) throw new ValidationError('Status attribute is mandatory');
    if (typeof this.status !== 'boolean') throw new ValidationError('Status attribute must be a boolean');
  }

  encryptPassword() {
    this.password = encryptPassword(this.password);
  }
};
