const express = require('express');
const cors = require('cors');

module.exports = class ApiExpress {
  constructor(app) {
    this.app = app;
  }

  static build() {
    const app = express();

    app.use(express.json());
    app.use(cors({ origin: '*' }));

    return new ApiExpress(app);
  }

  addPostRoute(path, callback) {
    this.app.post(path, callback);
  }

  addGetRoute(path, callback) {
    this.app.get(path, callback);
  }

  addPutRoute(path, callback) {
    this.app.put(path, callback);
  }

  addPatchRoute(path, callback) {
    this.app.patch(path, callback);
  }

  start(port) {
    this.app.listen(port, () => {
      console.log(`Server running at port ${port}!`);
    });
  }
};
