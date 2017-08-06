const bcrypt   = require('bcrypt');
const bluebird = require('bluebird');

module.exports = function hashingService(
  config
) {
  return {
    compare,
    hash
  };

  function compare(plain, hashToCompare) {
    return bluebird.resolve(bcrypt.compare(plain, hashToCompare));
  }

  function hash(plainValue) {
    return bluebird.resolve(bcrypt.hash(plainValue, config.auth.saltRounds));
  }
};
