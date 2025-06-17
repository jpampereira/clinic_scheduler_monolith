const uuid = require('uuid-random');
const User = require('./user');
const ValidationError = require('../../errors/ValidationError');

module.exports = class Doctor extends User {
  constructor(id, name, cpf, birthdate, mail, phone, password, profile, status, crm, expertiseId) {
    super(id, name, cpf, birthdate, mail, phone, password, profile, status);

    this.crm = crm;
    this.expertiseId = expertiseId;
  }

  static build(name, cpf, birthdate, mail, phone, password, crm, expertiseId) {
    return new Doctor(
      uuid(),
      name,
      cpf,
      birthdate,
      mail,
      phone,
      password,
      'Doctor',
      false,
      crm,
      expertiseId,
    );
  }

  static with(id, name, cpf, birthdate, mail, phone, password, status, crm, expertiseId) {
    return new Doctor(
      id,
      name,
      cpf,
      birthdate,
      mail,
      phone,
      password,
      'Doctor',
      status,
      crm,
      expertiseId,
    );
  }

  validate() {
    super.validate();

    this.validateCrm();
    this.validateExpertiseId();
  }

  validateCrm() {
    if (!this.crm) throw new ValidationError('Crm attribute is mandatory');
    if (typeof this.crm !== 'string') throw new ValidationError('Crm attribute must be an string');
    if (!this.crm.match(/^CRM\/(AC|AL|AM|AP|BA|CE|DF|ES|GO|MA|MT|MS|MG|PA|PB|PR|PE|PI|RJ|RN|RS|RO|RR|SC|SP|SE|TO)\s+\d{6}$/)) throw new ValidationError('Crm attribute must be in format CRM/UF 6 digits');
  }

  validateExpertiseId() {
    if (!this.expertiseId) throw new ValidationError('ExpertiseId attribute is mandatory');
    if (typeof this.expertiseId !== 'string') throw new ValidationError('ExpertiseId attribute must be an string');
  }
};
