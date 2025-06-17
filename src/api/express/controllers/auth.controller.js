const UserRepository = require('../../../models/repositories/knex/user.repository');
const ExpertiseRepository = require('../../../models/repositories/knex/expertise.repository');
const UserService = require('../../../models/services/user.service');
const knex = require('../../../utils/knex');

module.exports = class AuthController {
  static build() {
    return new AuthController();
  }

  async signup(request, response) {
    try {
      const userRepository = UserRepository.build(knex);
      const expertiseRepository = ExpertiseRepository.build(knex);
      const userService = UserService.build(userRepository, expertiseRepository);

      const {
        name,
        cpf,
        birthdate,
        mail,
        phone,
        profile,
        password,
        crm,
        expertiseId,
      } = request.body;

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
};
