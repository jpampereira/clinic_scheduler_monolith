const apiExpress = require('./api/express/api.express');
const ExpertiseController = require('./api/express/controllers/expertise.controller');
const ProfileController = require('./api/express/controllers/profile.controller');

function main() {
  const api = apiExpress.build();

  const expertiseController = ExpertiseController.build();

  api.addPostRoute('/expertise', expertiseController.create);
  api.addGetRoute('/expertise', expertiseController.listAll);
  api.addGetRoute('/expertise/:id', expertiseController.listById);
  api.addPutRoute('/expertise/:id', expertiseController.update);

  const profileController = ProfileController.build();

  api.addPostRoute('/profile', profileController.create);
  api.addGetRoute('/profile', profileController.listAll);
  api.addGetRoute('/profile/:id', profileController.listById);
  api.addPutRoute('/profile/:id', profileController.update);

  api.start(process.env.APP_PORT);
}

main();
