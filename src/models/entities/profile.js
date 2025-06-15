const uuid = require('uuid-random');
const ValidationError = require('../../errors/ValidationError');

module.exports = class Profile {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  static build(name) {
    return new Profile(
      uuid(),
      name,
    );
  }

  static with(id, name) {
    return new Profile(
      id,
      name,
    );
  }

  validate() {
    if (!this.name) throw new ValidationError('Name attribute is mandatory');
    if (typeof this.name !== 'string') throw new ValidationError('Name attribute must be an string');
  }
};
