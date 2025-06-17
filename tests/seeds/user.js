const uuid = require('uuid-random');
const encryptPassword = require('../../src/utils/hashGenerator');

const expertiseId = uuid();

exports.seed = (knex) => {
  return knex('user').del()
    .then(() => knex('expertise').del())
    .then(() => knex('expertise').insert([
      {
        id: expertiseId,
        name: 'Neurologia',
        description: 'Neurologia é a especialidade médica que se dedica ao diagnóstico, tratamento e prevenção de doenças do sistema nervoso, incluindo o cérebro, medula espinhal e nervos periféricos.',
      },
    ]))
    .then(() => knex('user').insert([
      {
        id: uuid(),
        name: 'Stefany Carolina Assis',
        cpf: '14317125820',
        birthdate: '1980-01-01',
        mail: 'stefany.assis@mail.com',
        phone: '94981968224',
        password: encryptPassword('DPATTSbCw1'),
        profile: 'Doctor',
        status: false,
        crm: 'CRM/PA 123456',
        expertise_id: expertiseId,
      },
      {
        id: uuid(),
        name: 'Márcia Eliane Almeida',
        cpf: '77247398701',
        birthdate: '2006-04-13',
        mail: 'marcia.almeida@mail.com',
        phone: '65984573857',
        password: encryptPassword('qyhuqwkPNq'),
        profile: 'Patient',
        status: true,
        crm: null,
        expertise_id: null,
      },
      {
        id: uuid(),
        name: 'Agatha Betina Ribeiro',
        cpf: '71736572458',
        birthdate: '1949-01-27',
        mail: 'agatha.ribeiro@mail.com',
        phone: '91986168227',
        password: encryptPassword('ykGmrOHFFb'),
        profile: 'Patient',
        status: true,
        crm: null,
        expertise_id: null,
      },
      {
        id: uuid(),
        name: 'Juan Sebastião Joaquim da Silva',
        cpf: '07534750652',
        birthdate: '1991-02-02',
        mail: 'juan.silva@mail.com',
        phone: '92984439465',
        password: encryptPassword('lcL3p8ECql'),
        profile: 'Administrator',
        status: false,
        crm: null,
        expertise_id: null,
      },
      {
        id: uuid(),
        name: 'Giovana Sophia Vanessa Gomes',
        cpf: '55126112163',
        birthdate: '1997-01-26',
        mail: 'giovana.gomes@mail.com',
        phone: '82995391627',
        password: encryptPassword('euO8bNKMYU'),
        profile: 'Administrator',
        status: false,
        crm: null,
        expertise_id: null,
      },
      {
        id: uuid(),
        name: 'Bruno Bryan da Paz',
        cpf: '77662012085',
        birthdate: '1985-02-21',
        mail: 'bruno.paz@mail.com',
        phone: '67995313754',
        password: encryptPassword('tudQXDes0I'),
        profile: 'Administrator',
        status: false,
        crm: null,
        expertise_id: null,
      },
    ]));
};
