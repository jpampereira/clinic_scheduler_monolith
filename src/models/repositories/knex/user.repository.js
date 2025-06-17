const tableName = 'user';

module.exports = class UserRepository {
  constructor(knex) {
    this.knex = knex;
  }

  static build(knex) {
    return new UserRepository(knex);
  }

  save(user) {
    return this.knex(tableName)
      .insert(user, [
        'id',
        'name',
        'cpf',
        this.knex.raw('to_char(birthdate, \'YYYY-MM-DD\') as birthdate'),
        'mail',
        'phone',
        'password',
        'profile',
        'status',
        'crm',
        'expertise_id',
      ]);
  }

  list(filter = {}) {
    return this.knex(tableName)
      .select([
        'id',
        'name',
        'cpf',
        this.knex.raw('to_char(birthdate, \'YYYY-MM-DD\') as birthdate'),
        'mail',
        'phone',
        'password',
        'profile',
        'status',
        'crm',
        'expertise_id',
      ])
      .where(filter)
      .orderBy('created_at');
  }

  update(id, user) {
    return this.knex(tableName)
      .update(user)
      .where({ id });
  }
};
