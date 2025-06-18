const encryptPassword = require('../utils/hashGenerator');

exports.up = (knex) => {
  return knex('user').insert([{
    id: process.env.SUPER_ADMIN_ID,
    name: 'Super Administrator',
    cpf: process.env.SUPER_ADMIN_CPF,
    birthdate: '1996-12-11',
    mail: process.env.SUPER_ADMIN_MAIL,
    phone: '00000000000',
    password: encryptPassword(process.env.SUPER_ADMIN_PASSWORD),
    role: 'Administrator',
    status: true,
    crm: null,
    expertise_id: null,
    created_at: knex.fn.now(),
    updated_at: knex.fn.now(),
  }]);
};

exports.down = (knex) => {
  return knex('user').where('id', process.env.SUPER_ADMIN_ID).del();
};
