const uuid = require('uuid-random');

exports.seed = (knex) => {
  return knex('user').whereNot({ id: process.env.SUPER_ADMIN_ID }).del()
    .then(() => knex('expertise').del())
    .then(() => knex('expertise').insert([
      {
        id: uuid(),
        name: 'Cardiologia',
        description: 'Cardiologia é a especialidade médica que se dedica ao diagnóstico, tratamento e prevenção de doenças do coração e do sistema cardiovascular.',
      },
      {
        id: uuid(),
        name: 'Dermatologia',
        description: 'Dermatologia é a especialidade médica que se dedica ao diagnóstico, tratamento e prevenção de doenças da pele, cabelo e unhas.',
      },
      {
        id: uuid(),
        name: 'Neurologia',
        description: 'Neurologia é a especialidade médica que se dedica ao diagnóstico, tratamento e prevenção de doenças do sistema nervoso, incluindo o cérebro, medula espinhal e nervos periféricos.',
      },
      {
        id: uuid(),
        name: 'Urologia',
        description: 'Urologia é a especialidade médica que se dedica ao diagnóstico, tratamento e prevenção de doenças do sistema urinário e dos órgãos reprodutores masculinos',
      },
    ]));
};
