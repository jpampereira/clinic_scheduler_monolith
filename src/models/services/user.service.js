const UserEntity = require('../entities/user');
const AdministratorEntity = require('../entities/administrator');
const PatientEntity = require('../entities/patient');
const DoctorEntity = require('../entities/doctor');
const ValidationError = require('../../errors/ValidationError');

module.exports = class UserService {
  constructor(userRepository, expertiseRepository) {
    this.userRepository = userRepository;
    this.expertiseRepository = expertiseRepository;
  }

  static build(userRepository, expertiseRepository) {
    return new UserService(userRepository, expertiseRepository);
  }

  async create(name, cpf, birthdate, mail, phone, role, password, crm, expertiseId) {
    let user;

    switch (role) {
      case 'Administrator':
        user = AdministratorEntity.build(name, cpf, birthdate, mail, phone, password);
        break;

      case 'Patient':
        user = PatientEntity.build(name, cpf, birthdate, mail, phone, password);
        break;

      case 'Doctor':
        user = DoctorEntity.build(name, cpf, birthdate, mail, phone, password, crm, expertiseId);
        break;

      default:
        user = UserEntity.build(name, cpf, birthdate, mail, phone, password, role);
        break;
    }

    user.validate();

    let dbResult;

    dbResult = await this.userRepository.list({ cpf: user.cpf });
    if (dbResult.length > 0) {
      throw new ValidationError(`Cpf '${user.cpf}' is already in use`);
    }

    dbResult = await this.userRepository.list({ phone: user.phone });
    if (dbResult.length > 0) {
      throw new ValidationError(`Phone '${user.phone}' is already in use`);
    }

    dbResult = await this.userRepository.list({ mail: user.mail });
    if (dbResult.length > 0) {
      throw new ValidationError(`Mail '${user.mail}' is already in use`);
    }

    if (user.role === 'Doctor') {
      dbResult = await this.userRepository.list({ crm: user.crm });
      if (dbResult.length > 0) {
        throw new ValidationError(`Crm '${user.crm}' is already in use`);
      }

      dbResult = await this.expertiseRepository.list({ id: user.expertiseId });
      if (dbResult.length === 0) {
        throw new ValidationError(`ExpertiseId '${user.expertiseId}' not exists`);
      }
    }

    user.encryptPassword();

    const output = await this.userRepository.save({
      id: user.id,
      name: user.name,
      cpf: user.cpf,
      birthdate: user.birthdate,
      mail: user.mail,
      phone: user.phone,
      password: user.password,
      role: user.role,
      status: user.status,
      crm: user.crm,
      expertise_id: user.expertiseId,
    });

    return output;
  }

  async list(filter) {
    let output;

    output = await this.userRepository.list(filter);
    output = output.filter((user) => user.id !== process.env.SUPER_ADMIN_ID);

    return output;
  }

  async update(id, name, cpf, birthdate, mail, phone, crm, expertiseId) {
    let [user] = await this.userRepository.list({ id });

    if (user !== undefined) {
      switch (user.role) {
        case 'Administrator':
          user = AdministratorEntity.with(id, name, cpf, birthdate, mail, phone, user.password, user.status);
          break;

        case 'Patient':
          user = PatientEntity.with(id, name, cpf, birthdate, mail, phone, user.password, user.status);
          break;

        case 'Doctor':
          user = DoctorEntity.with(id, name, cpf, birthdate, mail, phone, user.password, user.status, crm, expertiseId);
          break;

        default:
          user = UserEntity.with(id, name, cpf, birthdate, mail, phone, user.password, user.role, user.status);
          break;
      }

      user.validate();

      let dbResult;

      dbResult = await this.userRepository.list({ cpf: user.cpf });
      if (dbResult.length > 0 && dbResult[0].id !== user.id) {
        throw new ValidationError(`Cpf '${user.cpf}' is already in use`);
      }

      dbResult = await this.userRepository.list({ phone: user.phone });
      if (dbResult.length > 0 && dbResult[0].id !== user.id) {
        throw new ValidationError(`Phone '${user.phone}' is already in use`);
      }

      dbResult = await this.userRepository.list({ mail: user.mail });
      if (dbResult.length > 0 && dbResult[0].id !== user.id) {
        throw new ValidationError(`Mail '${user.mail}' is already in use`);
      }

      if (user.role === 'Doctor') {
        dbResult = await this.userRepository.list({ crm: user.crm });
        if (dbResult.length > 0 && dbResult[0].id !== user.id) {
          throw new ValidationError(`Crm '${user.crm}' is already in use`);
        }

        dbResult = await this.expertiseRepository.list({ id: user.expertiseId });
        if (dbResult.length === 0) {
          throw new ValidationError(`ExpertiseId '${user.expertiseId}' not exists`);
        }
      }

      await this.userRepository.update(
        user.id,
        {
          name: user.name,
          cpf: user.cpf,
          birthdate: user.birthdate,
          mail: user.mail,
          phone: user.phone,
          crm: user.crm,
          expertise_id: user.expertiseId,
        },
      );
    }
  }

  async setStatus(id, action) {
    let user;

    [user] = await this.userRepository.list({ id });

    if (user !== undefined) {
      switch (user.role) {
        case 'Administrator':
          user = AdministratorEntity.with(user.id, user.name, user.cpf, user.birthdate, user.mail, user.phone, user.password, user.status);
          break;

        case 'Patient':
          user = PatientEntity.with(user.id, user.name, user.cpf, user.birthdate, user.mail, user.phone, user.password, user.status);
          break;

        case 'Doctor':
          user = DoctorEntity.with(user.id, user.name, user.cpf, user.birthdate, user.mail, user.phone, user.password, user.status, user.crm, user.expertiseId);
          break;

        default:
          user = UserEntity.with(user.id, user.name, user.cpf, user.birthdate, user.mail, user.phone, user.password, user.role, user.status);
          break;
      }

      if (action.match(/deactivate/)) {
        user.deactivate();
      } else {
        user.activate();
      }

      await this.userRepository.update(
        user.id,
        {
          status: user.status,
        },
      );
    }
  }
};
