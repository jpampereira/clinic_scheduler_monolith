const request = require('supertest');
const knex = require('../../src/utils/knex');

const API_URL = `127.0.0.1:${process.env.APP_PORT}`;
const MAIN_ROUTE = '/auth';
const EXPERTISE_ROUTE = '/expertise';

let expertiseId;

beforeAll(() => {
  return knex.seed.run({ specific: 'auth.js' })
    .then(() => {
      return request(API_URL).post(EXPERTISE_ROUTE)
        .send({
          name: 'Ortopedia',
          description: 'Ortopedia é a especialidade médica que se dedica ao diagnóstico, tratamento e prevenção de doenças e lesões do sistema músculoesquelético',
        });
    })
    .then((res) => {
      expertiseId = res.body.id;
    });
});

test('Must create a new patient user by signup route', () => {
  return request(API_URL).post(`${MAIN_ROUTE}/signup`)
    .send({
      name: 'Bernardo Raimundo Duarte',
      cpf: '37002462261',
      birthdate: '1955-04-13',
      mail: 'bernardo.duarte@mail.com',
      phone: '27986155673',
      profile: 'Patient',
      password: 'PmiGoKCD2N',
    })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', 'Bernardo Raimundo Duarte');
      expect(res.body).toHaveProperty('cpf', '37002462261');
      expect(res.body).toHaveProperty('birthdate', '1955-04-13');
      expect(res.body).toHaveProperty('mail', 'bernardo.duarte@mail.com');
      expect(res.body).toHaveProperty('phone', '27986155673');
      expect(res.body).toHaveProperty('profile', 'Patient');
      expect(res.body).not.toHaveProperty('password');
      expect(res.body).toHaveProperty('status', true);
      expect(res.body).toHaveProperty('crm', null);
      expect(res.body).toHaveProperty('expertiseId', null);
    });
});

test('Must create a new administrator user by signup route', () => {
  return request(API_URL).post(`${MAIN_ROUTE}/signup`)
    .send({
      name: 'Rosângela Carolina Kamilly Caldeira',
      cpf: '08168095340',
      birthdate: '1993-03-12',
      mail: 'rosangela.caldeira@mail.com',
      phone: '81997744857',
      profile: 'Administrator',
      password: 'fetuHDJdKd',
    })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', 'Rosângela Carolina Kamilly Caldeira');
      expect(res.body).toHaveProperty('cpf', '08168095340');
      expect(res.body).toHaveProperty('birthdate', '1993-03-12');
      expect(res.body).toHaveProperty('mail', 'rosangela.caldeira@mail.com');
      expect(res.body).toHaveProperty('phone', '81997744857');
      expect(res.body).toHaveProperty('profile', 'Administrator');
      expect(res.body).not.toHaveProperty('password');
      expect(res.body).toHaveProperty('status', false);
      expect(res.body).toHaveProperty('crm', null);
      expect(res.body).toHaveProperty('expertiseId', null);
    });
});

test('Must create a new doctor user by signup route', () => {
  return request(API_URL).post(`${MAIN_ROUTE}/signup`)
    .send({
      name: 'Martin Manuel Rocha',
      cpf: '50793629870',
      birthdate: '1984-03-08',
      mail: 'martin.rocha@mail.com',
      phone: '82987230572',
      profile: 'Doctor',
      password: '9miwzDsfQU',
      crm: 'CRM/AL 123456',
      expertiseId,
    })
    .then((res) => {
      expect(expertiseId).toBeDefined();
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', 'Martin Manuel Rocha');
      expect(res.body).toHaveProperty('cpf', '50793629870');
      expect(res.body).toHaveProperty('birthdate', '1984-03-08');
      expect(res.body).toHaveProperty('mail', 'martin.rocha@mail.com');
      expect(res.body).toHaveProperty('phone', '82987230572');
      expect(res.body).toHaveProperty('profile', 'Doctor');
      expect(res.body).not.toHaveProperty('password');
      expect(res.body).toHaveProperty('status', false);
      expect(res.body).toHaveProperty('crm', 'CRM/AL 123456');
      expect(res.body).toHaveProperty('expertiseId', expertiseId);
    });
});

// Example using a doctor but it works for every user profile
describe('Must not create a new user by signup route...', () => {
  const testTemplate = (newUser, errorMessage) => {
    return request(API_URL).post(`${MAIN_ROUTE}/signup`)
      .send(newUser)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  const doctor = {
    name: 'Gabriela Alana Aragão',
    cpf: '58709354077',
    birthdate: '1971-03-10',
    mail: 'gabriela.aragao@mail.com',
    phone: '86994246007',
    profile: 'Doctor',
    password: '8M123KdiQE',
    crm: 'CRM/PI 123456',
  };

  test('...without name attribute', () => testTemplate({ ...doctor, expertiseId, name: undefined }, 'Name attribute is mandatory'));
  test('...with name attribute out of format', () => testTemplate({ ...doctor, expertiseId, name: 1 }, 'Name attribute must be an string'));

  test('...without cpf attribute', () => testTemplate({ ...doctor, expertiseId, cpf: undefined }, 'Cpf attribute is mandatory'));
  test('...with cpf attribute out of type', () => testTemplate({ ...doctor, expertiseId, cpf: parseInt(doctor.cpf, 10) }, 'Cpf attribute must be an string'));
  test('...with cpf attribute out of format', () => testTemplate({ ...doctor, expertiseId, cpf: '587.093.540-77' }, 'Cpf attribute must be in format of 11 digits without non-number characters'));
  test('...with an invalid cpf', () => testTemplate({ ...doctor, expertiseId, cpf: '58709354076' }, 'Cpf attribute is invalid'));
  test('...with a cpf already in use', () => testTemplate({ ...doctor, expertiseId, cpf: '50793629870' }, 'Cpf \'50793629870\' is already in use'));

  test('...without birthdate attribute', () => testTemplate({ ...doctor, expertiseId, birthdate: undefined }, 'Birthdate attribute is mandatory'));
  test('...with birthdate attribute out of type', () => testTemplate({ ...doctor, expertiseId, birthdate: 1 }, 'Birthdate attribute must be an string'));
  test('...with birthdate attribute out of format', () => testTemplate({ ...doctor, expertiseId, birthdate: '10/03/1971' }, 'Birthdate attribute must be in format YYYY-MM-DD'));
  test('...with an invalid birthdate', () => testTemplate({ ...doctor, expertiseId, birthdate: '1971-13-10' }, 'Birthdate attribute is invalid'));
  test('...with an birthdate after current date', () => testTemplate({ ...doctor, expertiseId, birthdate: '2071-03-10' }, 'Birthdate attribute value did not happened yet'));

  test('...without mail attribute', () => testTemplate({ ...doctor, expertiseId, mail: undefined }, 'Mail attribute is mandatory'));
  test('...with mail attribute out of type', () => testTemplate({ ...doctor, expertiseId, mail: 1 }, 'Mail attribute must be an string'));
  test('...with mail attribute out of format', () => testTemplate({ ...doctor, expertiseId, mail: doctor.mail.replace(/@.*/, '') }, 'Mail attribute must be in format username@domain.com'));
  test('...with an mail already in use', () => testTemplate({ ...doctor, expertiseId, mail: 'martin.rocha@mail.com' }, 'Mail \'martin.rocha@mail.com\' is already in use'));

  test('...without phone attribute', () => testTemplate({ ...doctor, expertiseId, phone: undefined }, 'Phone attribute is mandatory'));
  test('...with phone attribute out of type', () => testTemplate({ ...doctor, expertiseId, phone: parseInt(doctor.phone, 10) }, 'Phone attribute must be an string'));
  test('...with phone attribute out of format', () => testTemplate({ ...doctor, expertiseId, phone: '(86) 99424-6007' }, 'Phone attribute must be in format DDD+9 digits'));
  test('...with a phone already in use', () => testTemplate({ ...doctor, expertiseId, phone: '82987230572' }, 'Phone \'82987230572\' is already in use'));

  test('...without profile attribute', () => testTemplate({ ...doctor, expertiseId, profile: undefined }, 'Profile attribute is mandatory'));
  test('...with profile attribute out of format', () => testTemplate({ ...doctor, expertiseId, profile: 1 }, 'Profile attribute must be an string'));
  test('...with an invalid profile', () => testTemplate({ ...doctor, expertiseId, profile: 'Teste' }, 'Profile attribute must be \'Administrator\', \'Patient\' or \'Doctor\''));

  test('...without password attribute', () => testTemplate({ ...doctor, expertiseId, password: undefined }, 'Password attribute is mandatory'));
  test('...with password attribute out of format', () => testTemplate({ ...doctor, expertiseId, password: 1234567890 }, 'Password attribute must be an string'));

  test('...without crm attribute', () => testTemplate({ ...doctor, expertiseId, crm: undefined }, 'Crm attribute is mandatory'));
  test('...with crm attribute out of type', () => testTemplate({ ...doctor, expertiseId, crm: 1 }, 'Crm attribute must be an string'));
  test('...with crm attribute out of format', () => testTemplate({ ...doctor, expertiseId, crm: doctor.crm.replace('/', '-') }, 'Crm attribute must be in format CRM/UF 6 digits'));
  test('...with a crm already in use', () => testTemplate({ ...doctor, expertiseId, crm: 'CRM/AL 123456' }, 'Crm \'CRM/AL 123456\' is already in use'));

  test('...without expertiseId attribute', () => testTemplate({ ...doctor, expertiseId: undefined }, 'ExpertiseId attribute is mandatory'));
  test('...with expertiseId attribute out of format', () => testTemplate({ ...doctor, expertiseId: 1 }, 'ExpertiseId attribute must be an string'));
  test('...with a expertiseId that not exists', () => testTemplate({ ...doctor, expertiseId: `${expertiseId}x` }, `ExpertiseId '${expertiseId}x' not exists`));
});
