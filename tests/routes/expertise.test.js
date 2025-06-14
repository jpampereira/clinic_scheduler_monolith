const request = require('supertest');
const { execSync } = require('child_process');

const API_URL = `127.0.0.1:${process.env.APP_PORT}`;
const MAIN_ROUTE = '/expertise';

const expertise1 = {
  name: 'Especialidade Sem Nome',
  description: 'Especialidade Sem Descrição',
};

const expertise2 = {
  name: 'Ortopedia',
  description: 'Ortopedia é a especialidade médica que se dedica ao diagnóstico, tratamento e prevenção de doenças e lesões do sistema músculoesquelético.',
};

beforeAll(() => {
  execSync('npx knex seed:run --specific=expertise.js');
});

test('Must insert a new expertise', () => {
  return request(API_URL).post(MAIN_ROUTE)
    .send(expertise1)
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', expertise1.name);
      expect(res.body).toHaveProperty('description', expertise1.description);

      expertise1.id = res.body.id;
    });
});

describe('Must not insert a new expertise...', () => {
  const testTemplate = (newExpertise, errorMessage) => {
    return request(API_URL).post(MAIN_ROUTE)
      .send(newExpertise)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('...without name attribute', () => testTemplate({ ...expertise2, name: undefined }, 'Name attribute is mandatory'));
  test('...with name attribute out of format', () => testTemplate({ ...expertise2, name: 1 }, 'Name attribute must be an string'));
  test('...with a name already in use', () => testTemplate({ ...expertise2, name: expertise1.name }, `Name '${expertise1.name}' is already in use`));

  test('...without description attribute', () => testTemplate({ ...expertise2, description: undefined }, 'Description attribute is mandatory'));
  test('...with description attribute out of format', () => testTemplate({ ...expertise2, description: 1 }, 'Description attribute must be an string'));
});

test('Must return all expertises', () => {
  return request(API_URL).get(MAIN_ROUTE)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(1);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('description');
    });
});

test('Must return an expertise by id', () => {
  return request(API_URL).get(`${MAIN_ROUTE}/${expertise1.id}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0]).toHaveProperty('id', expertise1.id);
      expect(res.body[0]).toHaveProperty('name', expertise1.name);
      expect(res.body[0]).toHaveProperty('description', expertise1.description);
    });
});

describe('Must update an expertise by id', () => {
  test('Update expertise', () => {
    return request(API_URL).put(`${MAIN_ROUTE}/${expertise1.id}`)
      .send({
        name: 'Ginecologia',
        description: 'Ginecologia é a especialidade médica que se dedica ao estudo, diagnóstico, prevenção e tratamento de doenças do sistema reprodutor feminino.',
      })
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });

  test('Check if the expertise have been updated', () => {
    return request(API_URL).get(`${MAIN_ROUTE}/${expertise1.id}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('id', expertise1.id);
        expect(res.body[0]).toHaveProperty('name', 'Ginecologia');
        expect(res.body[0]).toHaveProperty('description', 'Ginecologia é a especialidade médica que se dedica ao estudo, diagnóstico, prevenção e tratamento de doenças do sistema reprodutor feminino.');
      });
  });
});

describe('Must not updated a expertise by id...', () => {
  const testTemplate = (expertiseId, updatedExpertise, errorMessage) => {
    return request(API_URL).put(`${MAIN_ROUTE}/${expertiseId}`)
      .send(updatedExpertise)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('Inserting second expertise', () => {
    return request(API_URL).post(MAIN_ROUTE)
      .send(expertise2)
      .then((res) => {
        expect(res.status).toBe(201);
      });
  });

  test('...without name attribute', () => testTemplate(expertise1.id, { ...expertise1, name: '' }, 'Name attribute is mandatory'));
  test('...with name attribute out of format', () => testTemplate(expertise1.id, { ...expertise1, name: 1 }, 'Name attribute must be an string'));
  test('...with a name already in use', () => testTemplate(expertise1.id, { ...expertise1, name: expertise2.name }, `Name '${expertise2.name}' is already in use`));

  test('...without description attribute', () => testTemplate(expertise1.id, { ...expertise1, description: '' }, 'Description attribute is mandatory'));
  test('...with description attribute out of format', () => testTemplate(expertise1.id, { ...expertise1, description: 1 }, 'Description attribute must be an string'));
});
