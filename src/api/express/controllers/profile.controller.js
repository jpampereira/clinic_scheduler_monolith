const ProfileRepository = require('../../../models/repositories/knex/profile.repository');
const ProfileService = require('../../../models/services/profile.service');
const knex = require('../../../utils/knex');
const exceptionHandling = require('../api.express.exception');

module.exports = class ProfileController {
  static build() {
    return new ProfileController();
  }

  async create(request, response) {
    try {
      const repository = ProfileRepository.build(knex);
      const service = ProfileService.build(repository);

      const { name } = request.body;

      const output = await service.create(name);

      const data = {
        id: output[0].id,
        name: output[0].name,
      };

      response.status(201).json(data);
    } catch (error) {
      exceptionHandling(error, response);
    }
  }

  async listAll(_, response) {
    try {
      const repository = ProfileRepository.build(knex);
      const service = ProfileService.build(repository);

      const output = await service.list();

      if (output.length > 0) {
        const data = output.map((item) => {
          return {
            id: item.id,
            name: item.name,
          };
        });

        response.status(200).json(data);
      } else {
        response.status(204).send();
      }
    } catch (error) {
      exceptionHandling(error, response);
    }
  }

  async listById(request, response) {
    try {
      const repository = ProfileRepository.build(knex);
      const service = ProfileService.build(repository);

      const { id } = request.params;

      const output = await service.list({ id });

      if (output.length > 0) {
        const data = output.map((item) => {
          return {
            id: item.id,
            name: item.name,
          };
        });

        response.status(200).json(data);
      } else {
        response.status(204).send();
      }
    } catch (error) {
      exceptionHandling(error, response);
    }
  }

  async update(request, response) {
    try {
      const repository = ProfileRepository.build(knex);
      const service = ProfileService.build(repository);

      const { id } = request.params;
      const { name } = request.body;

      await service.update(id, name);

      response.status(204).send();
    } catch (error) {
      exceptionHandling(error, response);
    }
  }
};
