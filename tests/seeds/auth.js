exports.seed = (knex) => {
  return knex('user').whereNot({ id: process.env.SUPER_ADMIN_ID }).del()
    .then(() => knex('expertise').del());
};
