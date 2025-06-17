exports.seed = (knex) => {
  return knex('user').del()
    .then(() => knex('expertise').del());
};
