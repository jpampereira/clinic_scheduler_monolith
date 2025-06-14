const apiExpress = require('./api/express/api.express');
const ExpertiseController = require('./api/express/controllers/expertise.controller');

function main() {
  const api = apiExpress.build();

  const expertiseController = ExpertiseController.build();

  api.addPostRoute('/expertise', expertiseController.create);
  api.addGetRoute('/expertise', expertiseController.listAll);
  api.addGetRoute('/expertise/:id', expertiseController.listById);
  api.addPutRoute('/expertise/:id', expertiseController.update);

  api.start(process.env.APP_PORT);
}

main();
