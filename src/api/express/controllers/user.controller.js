const UserRepository = require('../../../models/repositories/knex/user.repository');
const ExpertiseRepository = require('../../../models/repositories/knex/expertise.repository');
const UserService = require('../../../models/services/user.service');
const knex = require('../../../utils/knex');

module.exports = class UserController {
  static build() {
    return new UserController();
  }

  async create(request, response) {
    try {
      const userRepository = UserRepository.build(knex);
      const expertiseRepository = ExpertiseRepository.build(knex);
      const userService = UserService.build(userRepository, expertiseRepository);

      const {
        body: {
          name,
          cpf,
          birthdate,
          mail,
          phone,
          profile,
          password,
          crm,
          expertiseId,
        },
      } = request;

      const output = await userService.create(
        name,
        cpf,
        birthdate,
        mail,
        phone,
        profile,
        password,
        crm,
        expertiseId,
      );

      const data = {
        id: output[0].id,
        name: output[0].name,
        cpf: output[0].cpf,
        birthdate: output[0].birthdate,
        mail: output[0].mail,
        phone: output[0].phone,
        profile: output[0].profile,
        status: output[0].status,
        crm: output[0].crm,
        expertiseId: output[0].expertise_id,
      };

      response.status(201).json(data);
    } catch (error) {
      response.status(error.httpStatus ?? 500).json({ error: error.message });
    }
  }

  async listAll(_, response) {
    try {
      const userRepository = UserRepository.build(knex);
      const userService = UserService.build(userRepository);

      const output = await userService.list();

      if (output.length > 0) {
        const data = output.map((user) => {
          return {
            id: user.id,
            name: user.name,
            cpf: user.cpf,
            birthdate: user.birthdate,
            mail: user.mail,
            phone: user.phone,
            profile: user.profile,
            status: user.status,
            crm: user.crm,
            expertiseId: user.expertise_id,
          };
        });

        response.status(200).json(data);
      } else {
        response.status(204).send();
      }
    } catch (error) {
      response.status(error.httpStatus ?? 500).json({ error: error.message });
    }
  }

  async listAllByProfile(request, response) {
    try {
      const userRepository = UserRepository.build(knex);
      const userService = UserService.build(userRepository);

      const { path } = request;
      let profile;

      if (path.match(/administrator/)) {
        profile = 'Administrator';
      } else if (path.match(/patient/)) {
        profile = 'Patient';
      } else if (path.match(/doctor/)) {
        profile = 'Doctor';
      }

      const output = await userService.list({ profile });

      if (output.length > 0) {
        const data = output.map((user) => {
          return {
            id: user.id,
            name: user.name,
            cpf: user.cpf,
            birthdate: user.birthdate,
            mail: user.mail,
            phone: user.phone,
            profile: user.profile,
            status: user.status,
            crm: user.crm,
            expertiseId: user.expertise_id,
          };
        });

        response.status(200).json(data);
      } else {
        response.status(204).send();
      }
    } catch (error) {
      response.status(error.httpStatus ?? 500).json({ error: error.message });
    }
  }

  async listById(request, response) {
    try {
      const userRepository = UserRepository.build(knex);
      const userService = UserService.build(userRepository);

      const { params: { id } } = request;

      const output = await userService.list({ id });

      if (output.length > 0) {
        const data = output.map((user) => {
          return {
            id: user.id,
            name: user.name,
            cpf: user.cpf,
            birthdate: user.birthdate,
            mail: user.mail,
            phone: user.phone,
            profile: user.profile,
            status: user.status,
            crm: user.crm,
            expertiseId: user.expertise_id,
          };
        });

        response.status(200).json(data);
      } else {
        response.status(204).send();
      }
    } catch (error) {
      response.status(error.httpStatus ?? 500).json({ error: error.message });
    }
  }

  async update(request, response) {
    try {
      const userRepository = UserRepository.build(knex);
      const expertiseRepository = ExpertiseRepository.build(knex);
      const userService = UserService.build(userRepository, expertiseRepository);

      const {
        params: {
          id,
        },
        body: {
          name,
          cpf,
          birthdate,
          mail,
          phone,
          crm,
          expertiseId,
        },
      } = request;

      await userService.update(
        id,
        name,
        cpf,
        birthdate,
        mail,
        phone,
        crm,
        expertiseId,
      );

      response.status(204).send();
    } catch (error) {
      response.status(error.httpStatus ?? 500).json({ error: error.message });
    }
  }

  async setStatus(request, response) {
    try {
      const userRepository = UserRepository.build(knex);
      const userService = UserService.build(userRepository);

      const { params: { id }, path } = request;

      await userService.setStatus(id, path);

      response.status(204).send();
    } catch (error) {
      response.status(error.httpStatus ?? 500).json({ error: error.message });
    }
  }
};
