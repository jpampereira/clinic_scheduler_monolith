const apiExpress = require('./api/express/api.express');
const ExpertiseController = require('./api/express/controllers/expertise.controller');
const AuthController = require('./api/express/controllers/auth.controller');
const UserController = require('./api/express/controllers/user.controller');

function main() {
  const api = apiExpress.build();

  const expertiseController = ExpertiseController.build();

  api.addPostRoute('/expertise', expertiseController.create);
  api.addGetRoute('/expertise', expertiseController.listAll);
  api.addGetRoute('/expertise/:id', expertiseController.listById);
  api.addPutRoute('/expertise/:id', expertiseController.update);

  const authController = AuthController.build();

  api.addPostRoute('/auth/signup', authController.signup);
  api.addPostRoute('/auth/signin', authController.signin);

  const userController = UserController.build();

  api.addGetRoute('/user', userController.listAll);
  api.addGetRoute('/user/administrator', userController.listAllByProfile);
  api.addGetRoute('/user/patient', userController.listAllByProfile);
  api.addGetRoute('/user/doctor', userController.listAllByProfile);
  api.addGetRoute('/user/:id', userController.listById);
  api.addPutRoute('/user/:id', userController.update);
  api.addPatchRoute('/user/:id/activate', userController.setStatus);
  api.addPatchRoute('/user/:id/deactivate', userController.setStatus);

  api.start(process.env.APP_PORT);
}

main();
