const ExpertiseRepository = require('../../../models/repositories/knex/expertise.repository');
const ExpertiseService = require('../../../models/services/expertise.service');
const knex = require('../../../utils/knex');

module.exports = class ExpertiseController {
  static build() {
    return new ExpertiseController();
  }

  async create(request, response) {
    try {
      const expertiseRepository = ExpertiseRepository.build(knex);
      const expertiseService = ExpertiseService.build(expertiseRepository);

      const { name, description } = request.body;

      const output = await expertiseService.create(name, description);

      const data = {
        id: output[0].id,
        name: output[0].name,
        description: output[0].description,
      };

      response.status(201).json(data);
    } catch (error) {
      response.status(error.httpStatus ?? 500).json({ error: error.message });
    }
  }

  async listAll(_, response) {
    try {
      const expertiseRepository = ExpertiseRepository.build(knex);
      const expertiseService = ExpertiseService.build(expertiseRepository);

      const output = await expertiseService.list();

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
      response.status(error.httpStatus ?? 500).json({ error: error.message });
    }
  }

  async listById(request, response) {
    try {
      const expertiseRepository = ExpertiseRepository.build(knex);
      const expertiseService = ExpertiseService.build(expertiseRepository);

      const { id } = request.params;

      const output = await expertiseService.list({ id });

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
      response.status(error.httpStatus ?? 500).json({ error: error.message });
    }
  }

  async update(request, response) {
    try {
      const expertiseRepository = ExpertiseRepository.build(knex);
      const expertiseService = ExpertiseService.build(expertiseRepository);

      const { id } = request.params;
      const { name, description } = request.body;

      await expertiseService.update(id, name, description);

      response.status(204).send();
    } catch (error) {
      response.status(error.httpStatus ?? 500).json({ error: error.message });
    }
  }
};
