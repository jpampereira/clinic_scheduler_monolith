const uuid = require('uuid-random');
const ValidationError = require('../../errors/ValidationError');

module.exports = class ExpertiseEntity {
  constructor(id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  static build(name, description) {
    return new ExpertiseEntity(
      uuid(),
      name,
      description,
    );
  }

  static with(id, name, description) {
    return new ExpertiseEntity(
      id,
      name,
      description,
    );
  }

  validate() {
    if (!this.name) throw new ValidationError('Name attribute is mandatory');
    if (!this.description) throw new ValidationError('Description attribute is mandatory');
    if (typeof this.name !== 'string') throw new ValidationError('Name attribute must be an string');
    if (typeof this.description !== 'string') throw new ValidationError('Description attribute must be an string');
  }
};
