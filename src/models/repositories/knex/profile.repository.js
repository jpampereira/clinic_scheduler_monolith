const tableName = 'profile';

module.exports = class ProfileRepository {
  constructor(knex) {
    this.knex = knex;
  }

  static build(knex) {
    return new ProfileRepository(knex);
  }

  save(profile) {
    return this.knex(tableName)
      .insert(profile, [
        'id',
        'name',
      ]);
  }

  list(filter = {}) {
    return this.knex(tableName)
      .select([
        'id',
        'name',
      ])
      .where(filter)
      .orderBy('created_at');
  }

  update(id, profile) {
    return this.knex(tableName)
      .update(profile)
      .where({ id });
  }
};
