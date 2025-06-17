const request = require('supertest');
const { execSync } = require('child_process');

const API_URL = `127.0.0.1:${process.env.APP_PORT}`;
const MAIN_ROUTE = '/user';
const EXPERTISE_ROUTE = '/expertise';

const patient1 = {
  name: 'Bernardo Raimundo Duarte',
  cpf: '37002462261',
  birthdate: '1955-04-13',
  mail: 'bernardo.duarte@mail.com',
  phone: '27986155673',
  profile: 'Patient',
  password: 'PmiGoKCD2N',
};

const administrator1 = {
  name: 'Rosângela Carolina Kamilly Caldeira',
  cpf: '08168095340',
  birthdate: '1993-03-12',
  mail: 'rosangela.caldeira@mail.com',
  phone: '81997744857',
  profile: 'Administrator',
  password: 'fetuHDJdKd',
};

const expertise = {
  name: 'Ortopedia',
  description: 'Ortopedia é a especialidade médica que se dedica ao diagnóstico, tratamento e prevenção de doenças e lesões do sistema músculoesquelético',
};

const doctor1 = {
  name: 'Martin Manuel Rocha',
  cpf: '50793629870',
  birthdate: '1984-03-08',
  mail: 'martin.rocha@mail.com',
  phone: '82987230572',
  profile: 'Doctor',
  password: '9miwzDsfQU',
  crm: 'CRM/AL 123456',
};

const doctor2 = {
  name: 'Gabriela Alana Aragão',
  cpf: '58709354077',
  birthdate: '1971-03-10',
  mail: 'gabriela.aragao@mail.com',
  phone: '86994246007',
  profile: 'Doctor',
  password: '8M123KdiQE',
  crm: 'CRM/PI 123456',
};

beforeAll(() => {
  execSync('npx knex seed:run --specific=user.js');
});

test('Must insert a new patient', () => {
  return request(API_URL).post('/signup')
    .send(patient1)
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', patient1.name);
      expect(res.body).toHaveProperty('cpf', patient1.cpf);
      expect(res.body).toHaveProperty('birthdate', patient1.birthdate);
      expect(res.body).toHaveProperty('mail', patient1.mail);
      expect(res.body).toHaveProperty('phone', patient1.phone);
      expect(res.body).toHaveProperty('profile', patient1.profile);
      expect(res.body).not.toHaveProperty('password');
      expect(res.body).toHaveProperty('status', true);
      expect(res.body).toHaveProperty('crm', null);
      expect(res.body).toHaveProperty('expertiseId', null);

      patient1.id = res.body.id;
    });
});

test('Must insert a new administrator', () => {
  return request(API_URL).post('/signup')
    .send(administrator1)
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', administrator1.name);
      expect(res.body).toHaveProperty('cpf', administrator1.cpf);
      expect(res.body).toHaveProperty('birthdate', administrator1.birthdate);
      expect(res.body).toHaveProperty('mail', administrator1.mail);
      expect(res.body).toHaveProperty('phone', administrator1.phone);
      expect(res.body).toHaveProperty('profile', administrator1.profile);
      expect(res.body).not.toHaveProperty('password');
      expect(res.body).toHaveProperty('status', false);
      expect(res.body).toHaveProperty('crm', null);
      expect(res.body).toHaveProperty('expertiseId', null);

      administrator1.id = res.body.id;
    });
});

describe('Must insert a new doctor...', () => {
  test('Inserting a new expertise', () => {
    return request(API_URL).post(EXPERTISE_ROUTE)
      .send(expertise)
      .then((res) => {
        expect(res.status).toBe(201);

        expertise.id = res.body.id;
        doctor1.expertiseId = expertise.id;
        doctor2.expertiseId = expertise.id;
      });
  });

  test('Inserting the new doctor', () => {
    return request(API_URL).post('/signup')
      .send(doctor1)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('name', doctor1.name);
        expect(res.body).toHaveProperty('cpf', doctor1.cpf);
        expect(res.body).toHaveProperty('birthdate', doctor1.birthdate);
        expect(res.body).toHaveProperty('mail', doctor1.mail);
        expect(res.body).toHaveProperty('phone', doctor1.phone);
        expect(res.body).toHaveProperty('profile', doctor1.profile);
        expect(res.body).not.toHaveProperty('password');
        expect(res.body).toHaveProperty('status', false);
        expect(res.body).toHaveProperty('crm', doctor1.crm);
        expect(res.body).toHaveProperty('expertiseId', doctor1.expertiseId);

        doctor1.id = res.body.id;
      });
  });
});

// Example using a doctor but it works for every user profile
describe('Must not insert a new user...', () => {
  const testTemplate = (newUser, errorMessage) => {
    return request(API_URL).post('/signup')
      .send(newUser)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('...without name attribute', () => testTemplate({ ...doctor2, name: undefined }, 'Name attribute is mandatory'));
  test('...with name attribute out of format', () => testTemplate({ ...doctor2, name: 1 }, 'Name attribute must be an string'));

  test('...without cpf attribute', () => testTemplate({ ...doctor2, cpf: undefined }, 'Cpf attribute is mandatory'));
  test('...with cpf attribute out of type', () => testTemplate({ ...doctor2, cpf: parseInt(doctor2.cpf, 10) }, 'Cpf attribute must be an string'));
  test('...with cpf attribute out of format', () => testTemplate({ ...doctor2, cpf: '587.093.540-77' }, 'Cpf attribute must be in format of 11 digits without non-number characters'));
  test('...with an invalid cpf', () => testTemplate({ ...doctor2, cpf: '58709354070' }, 'Cpf attribute is invalid'));
  test('...with a cpf already in use', () => testTemplate({ ...doctor2, cpf: doctor1.cpf }, `Cpf '${doctor1.cpf}' is already in use`));

  test('...without birthdate attribute', () => testTemplate({ ...doctor2, birthdate: undefined }, 'Birthdate attribute is mandatory'));
  test('...with birthdate attribute out of type', () => testTemplate({ ...doctor2, birthdate: 1 }, 'Birthdate attribute must be an string'));
  test('...with birthdate attribute out of format', () => testTemplate({ ...doctor2, birthdate: '10/03/1971' }, 'Birthdate attribute must be in format YYYY-MM-DD'));
  test('...with an invalid birthdate', () => testTemplate({ ...doctor2, birthdate: '1971-13-10' }, 'Birthdate attribute is invalid'));
  test('...with an birthdate after current date', () => testTemplate({ ...doctor2, birthdate: '2071-03-10' }, 'Birthdate attribute value did not happened yet'));

  test('...without mail attribute', () => testTemplate({ ...doctor2, mail: undefined }, 'Mail attribute is mandatory'));
  test('...with mail attribute out of type', () => testTemplate({ ...doctor2, mail: 1 }, 'Mail attribute must be an string'));
  test('...with mail attribute out of format', () => testTemplate({ ...doctor2, mail: doctor2.mail.replace(/@.*/, '') }, 'Mail attribute must be in format username@domain.com'));
  test('...with an mail already in use', () => testTemplate({ ...doctor2, mail: doctor1.mail }, `Mail '${doctor1.mail}' is already in use`));

  test('...without phone attribute', () => testTemplate({ ...doctor2, phone: undefined }, 'Phone attribute is mandatory'));
  test('...with phone attribute out of type', () => testTemplate({ ...doctor2, phone: parseInt(doctor2.phone, 10) }, 'Phone attribute must be an string'));
  test('...with phone attribute out of format', () => testTemplate({ ...doctor2, phone: '(86) 99424-6007' }, 'Phone attribute must be in format DDD+9 digits'));
  test('...with a phone already in use', () => testTemplate({ ...doctor2, phone: doctor1.phone }, `Phone '${doctor1.phone}' is already in use`));

  test('...without profile attribute', () => testTemplate({ ...doctor2, profile: undefined }, 'Profile attribute is mandatory'));
  test('...with profile attribute out of format', () => testTemplate({ ...doctor2, profile: 1 }, 'Profile attribute must be an string'));
  test('...with an invalid profile', () => testTemplate({ ...doctor2, profile: 'Teste' }, 'Profile attribute must be \'Administrator\', \'Patient\' or \'Doctor\''));

  test('...without password attribute', () => testTemplate({ ...doctor2, password: undefined }, 'Password attribute is mandatory'));
  test('...with password attribute out of format', () => testTemplate({ ...doctor2, password: 1234567890 }, 'Password attribute must be an string'));

  test('...without crm attribute', () => testTemplate({ ...doctor2, crm: undefined }, 'Crm attribute is mandatory'));
  test('...with crm attribute out of type', () => testTemplate({ ...doctor2, crm: 1 }, 'Crm attribute must be an string'));
  test('...with crm attribute out of format', () => testTemplate({ ...doctor2, crm: doctor2.crm.replace('/', '-') }, 'Crm attribute must be in format CRM/UF 6 digits'));
  test('...with a crm already in use', () => testTemplate({ ...doctor2, crm: doctor1.crm }, `Crm '${doctor1.crm}' is already in use`));

  test('...without expertiseId attribute', () => testTemplate({ ...doctor2, expertiseId: undefined }, 'ExpertiseId attribute is mandatory'));
  test('...with expertiseId attribute out of format', () => testTemplate({ ...doctor2, expertiseId: 1 }, 'ExpertiseId attribute must be an string'));
  test('...with a expertiseId that not exists', () => testTemplate({ ...doctor2, expertiseId: `${doctor2.expertiseId}x` }, `ExpertiseId '${doctor2.expertiseId}x' not exists`));
});

test('Must return all users', () => {
  return request(API_URL).get(MAIN_ROUTE)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(1);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('cpf');
      expect(res.body[0]).toHaveProperty('birthdate');
      expect(res.body[0]).toHaveProperty('mail');
      expect(res.body[0]).toHaveProperty('phone');
      expect(res.body[0]).toHaveProperty('profile');
      expect(res.body[0]).not.toHaveProperty('password');
      expect(res.body[0]).toHaveProperty('status');
      expect(res.body[0]).toHaveProperty('crm');
      expect(res.body[0]).toHaveProperty('expertiseId');
    });
});

test('Must return all administrators', () => {
  return request(API_URL).get(`${MAIN_ROUTE}/administrator`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(1);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('cpf');
      expect(res.body[0]).toHaveProperty('birthdate');
      expect(res.body[0]).toHaveProperty('mail');
      expect(res.body[0]).toHaveProperty('phone');
      expect(res.body[0]).toHaveProperty('profile', 'Administrator');
      expect(res.body[0]).not.toHaveProperty('password');
      expect(res.body[0]).toHaveProperty('status');
      expect(res.body[0]).toHaveProperty('crm');
      expect(res.body[0]).toHaveProperty('expertiseId');
    });
});

test('Must return all patients', () => {
  return request(API_URL).get(`${MAIN_ROUTE}/patient`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(1);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('cpf');
      expect(res.body[0]).toHaveProperty('birthdate');
      expect(res.body[0]).toHaveProperty('mail');
      expect(res.body[0]).toHaveProperty('phone');
      expect(res.body[0]).toHaveProperty('profile', 'Patient');
      expect(res.body[0]).not.toHaveProperty('password');
      expect(res.body[0]).toHaveProperty('status');
      expect(res.body[0]).toHaveProperty('crm');
      expect(res.body[0]).toHaveProperty('expertiseId');
    });
});

test('Must return all doctors', () => {
  return request(API_URL).get(`${MAIN_ROUTE}/doctor`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(1);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('cpf');
      expect(res.body[0]).toHaveProperty('birthdate');
      expect(res.body[0]).toHaveProperty('mail');
      expect(res.body[0]).toHaveProperty('phone');
      expect(res.body[0]).toHaveProperty('profile', 'Doctor');
      expect(res.body[0]).not.toHaveProperty('password');
      expect(res.body[0]).toHaveProperty('status');
      expect(res.body[0]).toHaveProperty('crm');
      expect(res.body[0]).toHaveProperty('expertiseId');
    });
});

// Example using a doctor but it works for every user profile
test('Must return an user by id', () => {
  return request(API_URL).get(`${MAIN_ROUTE}/${doctor1.id}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('name', doctor1.name);
      expect(res.body[0]).toHaveProperty('cpf', doctor1.cpf);
      expect(res.body[0]).toHaveProperty('birthdate', doctor1.birthdate);
      expect(res.body[0]).toHaveProperty('mail', doctor1.mail);
      expect(res.body[0]).toHaveProperty('phone', doctor1.phone);
      expect(res.body[0]).toHaveProperty('profile', doctor1.profile);
      expect(res.body[0]).not.toHaveProperty('password');
      expect(res.body[0]).toHaveProperty('status', false);
      expect(res.body[0]).toHaveProperty('crm', doctor1.crm);
      expect(res.body[0]).toHaveProperty('expertiseId', doctor1.expertiseId);
    });
});

describe('Must update an user by id', () => {
  test('Update user', () => {
    return request(API_URL).put(`${MAIN_ROUTE}/${patient1.id}`)
      .send({
        ...patient1,
        name: 'João Pedro de Abreu Martins Pereira',
        mail: 'joao.pereira@mail.com',
        birthdate: '1996-12-11',
      })
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });

  test('Check if the user has been updated', () => {
    return request(API_URL).get(`${MAIN_ROUTE}/${patient1.id}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('id', patient1.id);
        expect(res.body[0]).toHaveProperty('name', 'João Pedro de Abreu Martins Pereira');
        expect(res.body[0]).toHaveProperty('cpf', patient1.cpf);
        expect(res.body[0]).toHaveProperty('birthdate', '1996-12-11');
        expect(res.body[0]).toHaveProperty('mail', 'joao.pereira@mail.com');
        expect(res.body[0]).toHaveProperty('phone', patient1.phone);
        expect(res.body[0]).toHaveProperty('profile', patient1.profile);
        expect(res.body[0]).not.toHaveProperty('password');
        expect(res.body[0]).toHaveProperty('status', true);
        expect(res.body[0]).toHaveProperty('crm', null);
        expect(res.body[0]).toHaveProperty('expertiseId', null);
      });
  });
});

describe('Must not updated a user by id...', () => {
  const testTemplate = (userId, updatedUser, errorMessage) => {
    return request(API_URL).put(`${MAIN_ROUTE}/${userId}`)
      .send(updatedUser)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('Inserting a new user', () => {
    return request(API_URL).post('/signup')
      .send(doctor2)
      .then((res) => {
        expect(res.status).toBe(201);
      });
  });

  test('...without name attribute', () => testTemplate(doctor1.id, { ...doctor1, name: undefined }, 'Name attribute is mandatory'));
  test('...with name attribute out of format', () => testTemplate(doctor1.id, { ...doctor1, name: 1 }, 'Name attribute must be an string'));

  test('...without cpf attribute', () => testTemplate(doctor1.id, { ...doctor1, cpf: undefined }, 'Cpf attribute is mandatory'));
  test('...with cpf attribute out of type', () => testTemplate(doctor1.id, { ...doctor1, cpf: parseInt(doctor1.cpf, 10) }, 'Cpf attribute must be an string'));
  test('...with cpf attribute out of format', () => testTemplate(doctor1.id, { ...doctor1, cpf: '587.093.540-77' }, 'Cpf attribute must be in format of 11 digits without non-number characters'));
  test('...with an invalid cpf', () => testTemplate(doctor1.id, { ...doctor1, cpf: '58709354070' }, 'Cpf attribute is invalid'));
  test('...with a cpf already in use', () => testTemplate(doctor1.id, { ...doctor1, cpf: doctor2.cpf }, `Cpf '${doctor2.cpf}' is already in use`));

  test('...without birthdate attribute', () => testTemplate(doctor1.id, { ...doctor1, birthdate: undefined }, 'Birthdate attribute is mandatory'));
  test('...with birthdate attribute out of type', () => testTemplate(doctor1.id, { ...doctor1, birthdate: 1 }, 'Birthdate attribute must be an string'));
  test('...with birthdate attribute out of format', () => testTemplate(doctor1.id, { ...doctor1, birthdate: '10/03/1971' }, 'Birthdate attribute must be in format YYYY-MM-DD'));
  test('...with an invalid birthdate', () => testTemplate(doctor1.id, { ...doctor1, birthdate: '1971-13-10' }, 'Birthdate attribute is invalid'));
  test('...with an birthdate after current date', () => testTemplate(doctor1.id, { ...doctor1, birthdate: '2071-03-10' }, 'Birthdate attribute value did not happened yet'));

  test('...without mail attribute', () => testTemplate(doctor1.id, { ...doctor1, mail: undefined }, 'Mail attribute is mandatory'));
  test('...with mail attribute out of type', () => testTemplate(doctor1.id, { ...doctor1, mail: 1 }, 'Mail attribute must be an string'));
  test('...with mail attribute out of format', () => testTemplate(doctor1.id, { ...doctor1, mail: doctor1.mail.replace(/@.*/, '') }, 'Mail attribute must be in format username@domain.com'));
  test('...with an mail already in use', () => testTemplate(doctor1.id, { ...doctor1, mail: doctor2.mail }, `Mail '${doctor2.mail}' is already in use`));

  test('...without phone attribute', () => testTemplate(doctor1.id, { ...doctor1, phone: undefined }, 'Phone attribute is mandatory'));
  test('...with phone attribute out of type', () => testTemplate(doctor1.id, { ...doctor1, phone: parseInt(doctor1.phone, 10) }, 'Phone attribute must be an string'));
  test('...with phone attribute out of format', () => testTemplate(doctor1.id, { ...doctor1, phone: '(86) 99424-6007' }, 'Phone attribute must be in format DDD+9 digits'));
  test('...with a phone already in use', () => testTemplate(doctor1.id, { ...doctor1, phone: doctor2.phone }, `Phone '${doctor2.phone}' is already in use`));

  test('...without crm attribute', () => testTemplate(doctor1.id, { ...doctor1, crm: undefined }, 'Crm attribute is mandatory'));
  test('...with crm attribute out of type', () => testTemplate(doctor1.id, { ...doctor1, crm: 1 }, 'Crm attribute must be an string'));
  test('...with crm attribute out of format', () => testTemplate(doctor1.id, { ...doctor1, crm: doctor1.crm.replace('/', '-') }, 'Crm attribute must be in format CRM/UF 6 digits'));
  test('...with a crm already in use', () => testTemplate(doctor1.id, { ...doctor1, crm: doctor2.crm }, `Crm '${doctor2.crm}' is already in use`));

  test('...without expertiseId attribute', () => testTemplate(doctor1.id, { ...doctor1, expertiseId: undefined }, 'ExpertiseId attribute is mandatory'));
  test('...with expertiseId attribute out of format', () => testTemplate(doctor1.id, { ...doctor1, expertiseId: 1 }, 'ExpertiseId attribute must be an string'));
  test('...with a expertiseId that not exists', () => testTemplate(doctor1.id, { ...doctor1, expertiseId: `${doctor1.expertiseId}x` }, `ExpertiseId '${doctor1.expertiseId}x' not exists`));
});
