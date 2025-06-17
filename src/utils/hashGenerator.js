const bcrypt = require('bcrypt');

module.exports = (str) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(str, salt);

  return hash;
};
