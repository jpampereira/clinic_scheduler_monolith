const tableName = 'expertise';

module.exports = class ExpertiseRepository {
  constructor(knex) {
    this.knex = knex;
  }

  static build(knex) {
    return new ExpertiseRepository(knex);
  }

  save(expertise) {
    return this.knex(tableName)
      .insert(expertise, ['*']);
  }

  list(filter = {}) {
    return this.knex(tableName)
      .select(['*'])
      .where(filter)
      .orderBy('created_at');
  }

  update(id, expertise) {
    return this.knex(tableName)
      .update(expertise)
      .where({ id });
  }
};
