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
      .insert(expertise, [
        'id',
        'name',
        'description',
      ]);
  }

  list(filter = {}) {
    return this.knex(tableName)
      .select([
        'id',
        'name',
        'description',
      ])
      .where(filter)
      .orderBy('id');
  }

  update(id, expertise) {
    return this.knex(tableName)
      .update(expertise)
      .where({ id });
  }
};
