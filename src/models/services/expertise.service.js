const ExpertiseEntity = require('../entities/expertise');
const ValidationError = require('../../errors/ValidationError');

module.exports = class ExpertiseService {
  constructor(repository) {
    this.repository = repository;
  }

  static build(repository) {
    return new ExpertiseService(repository);
  }

  async create(name, description) {
    const expertise = ExpertiseEntity.build(name, description);

    expertise.validate();

    const dbResult = await this.repository.list({ name });
    if (dbResult.length > 0) {
      throw new ValidationError(`Name '${name}' is already in use`);
    }

    const output = await this.repository.save({
      id: expertise.id,
      name: expertise.name,
      description: expertise.description,
    });

    return output;
  }

  async list(filter) {
    const output = await this.repository.list(filter);

    return output;
  }

  async update(id, name, description) {
    const expertise = ExpertiseEntity.with(id, name, description);

    expertise.validate();

    const dbResult = await this.repository.list({ name });
    if (dbResult.length > 0) {
      throw new ValidationError(`Name '${name}' is already in use`);
    }

    await this.repository.update(
      id,
      {
        name,
        description,
      },
    );
  }
};
