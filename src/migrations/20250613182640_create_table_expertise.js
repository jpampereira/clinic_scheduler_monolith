exports.up = (knex) => {
  return knex.schema.createTable('expertise', (table) => {
    table.string('id').primary();
    table.string('name').notNull().unique();
    table.string('description').notNull();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
    .then(() => {
      return knex.raw(`
      CREATE OR REPLACE FUNCTION update_expertise_updated_at()
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
      CREATE TRIGGER expertise_before_update_updated_at
      BEFORE UPDATE ON expertise
      FOR EACH ROW
      EXECUTE FUNCTION update_expertise_updated_at();
    `);
    });
};

exports.down = (knex) => {
  return knex.raw('DROP TRIGGER IF EXISTS expertise_before_update_updated_at ON expertise')
    .then(() => {
      return knex.raw('DROP FUNCTION IF EXISTS update_expertise_updated_at()');
    })
    .then(() => {
      return knex.schema.dropTable('expertise');
    });
};
