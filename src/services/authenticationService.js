const bluebird = require('bluebird');
const errors   = require('http-errors');
const jwt      = require('jsonwebtoken');

module.exports = function authenticationService(
  config,
  hashingService,
  usersService
) {
  return {
    createToken
  };

  function createToken(context, code, password) {
    return usersService.get(context, code, true)
      .then(user => {
        return hashingService.compare(password, user.password)
          .then(result => {
            if (!result) {
              return bluebird.reject(new errors.BadRequest('Combinacion incorrecta de usuario y contraseña'));
            }

            return {
              bearer: jwt.sign({
                code: user.code,
                role: user.role
              },
              config.auth.secret,
              {expiresIn: config.auth.expiresIn})
            };
          })
        ;
      })
    ;
  }
};
