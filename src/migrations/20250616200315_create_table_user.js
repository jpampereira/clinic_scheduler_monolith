exports.up = (knex) => {
  return knex.schema.createTable('user', (table) => {
    table.string('id').primary();
    table.string('name').notNull();
    table.string('cpf').notNull().unique();
    table.date('birthdate').notNull();
    table.string('mail').notNull().unique();
    table.string('phone').notNull().unique();
    table.string('password').notNull();
    table.enu('role', ['Administrator', 'Patient', 'Doctor']).notNull();
    table.boolean('status').notNull();
    table.string('crm');
    table.string('expertise_id').references('id').inTable('expertise');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
    .then(() => {
      return knex.raw(`
      CREATE OR REPLACE FUNCTION update_user_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    })
    .then(() => {
      return knex.raw(`
      CREATE TRIGGER user_before_update_updated_at
      BEFORE UPDATE ON "user"
      FOR EACH ROW
      EXECUTE FUNCTION update_user_updated_at();
    `);
    });
};

exports.down = (knex) => {
  return knex.raw('DROP TRIGGER IF EXISTS user_before_update_updated_at ON "user"')
    .then(() => {
      return knex.raw('DROP FUNCTION IF EXISTS update_user_updated_at()');
    })
    .then(() => {
      return knex.schema.dropTable('user');
    });
};
