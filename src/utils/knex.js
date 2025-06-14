const knex = require('knex');
const knexfile = require('../../knexfile');

const integration = knex(knexfile);

integration.migrate.latest();

module.exports = integration;
