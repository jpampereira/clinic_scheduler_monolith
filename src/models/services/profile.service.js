const ProfileEntity = require('../entities/profile');
const ValidationError = require('../../errors/ValidationError');

module.exports = class ProfileService {
  constructor(repository) {
    this.repository = repository;
  }

  static build(repository) {
    return new ProfileService(repository);
  }

  async create(name) {
    const profile = ProfileEntity.build(name);

    profile.validate();

    const dbResult = await this.repository.list({ name });
    if (dbResult.length > 0) {
      throw new ValidationError(`Name '${name}' is already in use`);
    }

    const output = await this.repository.save({
      id: profile.id,
      name: profile.name,
    });

    return output;
  }

  async list(filter) {
    const output = await this.repository.list(filter);

    return output;
  }

  async update(id, name) {
    const profile = ProfileEntity.with(id, name);

    profile.validate();

    const dbResult = await this.repository.list({ name });
    if (dbResult.length > 0) {
      throw new ValidationError(`Name '${name}' is already in use`);
    }

    await this.repository.update(
      id,
      {
        name,
      },
    );
  }
};
