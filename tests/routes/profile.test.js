const request = require('supertest');
const { execSync } = require('child_process');

const API_URL = `127.0.0.1:${process.env.APP_PORT}`;
const MAIN_ROUTE = '/profile';

const profile1 = {
  name: 'Perfil Sem Nome',
};

const profile2 = {
  name: 'Perfil Teste',
};

beforeAll(() => {
  execSync('npx knex seed:run --specific=profile.js');
});

test('Must insert a new profile', () => {
  return request(API_URL).post(MAIN_ROUTE)
    .send(profile1)
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', profile1.name);

      profile1.id = res.body.id;
    });
});

describe('Must not insert a new profile...', () => {
  const testTemplate = (newProfile, errorMessage) => {
    return request(API_URL).post(MAIN_ROUTE)
      .send(newProfile)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('...without name attribute', () => testTemplate({ ...profile2, name: undefined }, 'Name attribute is mandatory'));
  test('...with name attribute out of format', () => testTemplate({ ...profile2, name: 1 }, 'Name attribute must be an string'));
  test('...with a name already in use', () => testTemplate({ ...profile2, name: profile1.name }, `Name '${profile1.name}' is already in use`));
});

test('Must return all profiles', () => {
  return request(API_URL).get(MAIN_ROUTE)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(1);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('name');
    });
});

test('Must return an profile by id', () => {
  return request(API_URL).get(`${MAIN_ROUTE}/${profile1.id}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0]).toHaveProperty('id', profile1.id);
      expect(res.body[0]).toHaveProperty('name', profile1.name);
    });
});

describe('Must update an profile by id', () => {
  test('Update profile', () => {
    return request(API_URL).put(`${MAIN_ROUTE}/${profile1.id}`)
      .send({
        name: 'Técnico',
      })
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });

  test('Check if the profile have been updated', () => {
    return request(API_URL).get(`${MAIN_ROUTE}/${profile1.id}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('id', profile1.id);
        expect(res.body[0]).toHaveProperty('name', 'Técnico');
      });
  });
});

describe('Must not updated a profile by id...', () => {
  const testTemplate = (profileId, updatedProfile, errorMessage) => {
    return request(API_URL).put(`${MAIN_ROUTE}/${profileId}`)
      .send(updatedProfile)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('Inserting second expertise', () => {
    return request(API_URL).post(MAIN_ROUTE)
      .send(profile2)
      .then((res) => {
        expect(res.status).toBe(201);
      });
  });

  test('...without name attribute', () => testTemplate(profile1.id, { ...profile1, name: '' }, 'Name attribute is mandatory'));
  test('...with name attribute out of format', () => testTemplate(profile1.id, { ...profile1, name: 1 }, 'Name attribute must be an string'));
  test('...with a name already in use', () => testTemplate(profile1.id, { ...profile1, name: profile2.name }, `Name '${profile2.name}' is already in use`));
});
