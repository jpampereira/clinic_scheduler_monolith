const ExpertiseEntity = require('../entities/expertise');
const ValidationError = require('../../errors/ValidationError');

module.exports = class ExpertiseService {
  constructor(expertiseRepository) {
    this.expertiseRepository = expertiseRepository;
  }

  static build(expertiseRepository) {
    return new ExpertiseService(expertiseRepository);
  }

  async create(name, description) {
    const expertise = ExpertiseEntity.build(name, description);

    expertise.validate();

    const dbResult = await this.expertiseRepository.list({ name: expertise.name });
    if (dbResult.length > 0) {
      throw new ValidationError(`Name '${expertise.name}' is already in use`);
    }

    const output = await this.expertiseRepository.save({
      id: expertise.id,
      name: expertise.name,
      description: expertise.description,
    });

    return output;
  }

  async list(filter) {
    const output = await this.expertiseRepository.list(filter);

    return output;
  }

  async update(id, name, description) {
    let expertise;

    [expertise] = await this.expertiseRepository.list({ id });

    if (expertise !== undefined) {
      expertise = ExpertiseEntity.with(id, name, description);

      expertise.validate();

      const dbResult = await this.expertiseRepository.list({ name });
      if (dbResult.length > 0) {
        throw new ValidationError(`Name '${name}' is already in use`);
      }

      await this.expertiseRepository.update(
        id,
        {
          name: expertise.name,
          description: expertise.description,
        },
      );
    }
  }
};
