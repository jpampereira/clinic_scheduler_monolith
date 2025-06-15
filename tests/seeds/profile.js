const uuid = require('uuid-random');

exports.seed = (knex) => {
  return knex('profile').del()
    .then(() => knex('profile').insert([
      {
        id: uuid(),
        name: 'Administrador',
      },
      {
        id: uuid(),
        name: 'Paciente',
      },
      {
        id: uuid(),
        name: 'Médico',
      },
    ]));
};
