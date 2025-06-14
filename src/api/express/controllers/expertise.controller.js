const ExpertiseRepository = require('../../../models/repositories/knex/expertise.repository');
const ExpertiseService = require('../../../models/services/expertise.service');
const knex = require('../../../utils/knex');
const exceptionHandling = require('../api.express.exception');

module.exports = class ExpertiseController {
  static build() {
    return new ExpertiseController();
  }

  async create(request, response) {
    try {
      const repository = ExpertiseRepository.build(knex);
      const service = ExpertiseService.build(repository);

      const { name, description } = request.body;

      const output = await service.create(name, description);

      const data = {
        id: output[0].id,
        name: output[0].name,
        description: output[0].description,
      };

      response.status(201).json(data);
    } catch (error) {
      exceptionHandling(error, response);
    }
  }

  async listAll(_, response) {
    try {
      const repository = ExpertiseRepository.build(knex);
      const service = ExpertiseService.build(repository);

      const output = await service.list();

      if (output.length > 0) {
        const data = output.map((item) => {
          return {
            id: item.id,
            name: item.name,
            description: item.description,
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
      const repository = ExpertiseRepository.build(knex);
      const service = ExpertiseService.build(repository);

      const { id } = request.params;

      const output = await service.list({ id });

      if (output.length > 0) {
        const data = output.map((item) => {
          return {
            id: item.id,
            name: item.name,
            description: item.description,
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
      const repository = ExpertiseRepository.build(knex);
      const service = ExpertiseService.build(repository);

      const { id } = request.params;
      const { name, description } = request.body;

      await service.update(id, name, description);

      response.status(204).send();
    } catch (error) {
      exceptionHandling(error, response);
    }
  }
};
