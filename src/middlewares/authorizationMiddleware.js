const bluebird = require('bluebird');
const errors   = require('http-errors');
const jwt      = require('jsonwebtoken');

module.exports = function authorizationMiddleware(
  config,
  constants
) {
  return {
    anonymous,
    everyone,
    onlyAdmin,
    onlyUser
  };

  function anonymous(req, res, next) {
    next();
  }

  function everyone(req, res, next) {
    return validateToken(req)
      .nodeify(next)
    ;
  }

  function onlyAdmin(req, res, next) {
    return validateToken(req)
      .then(() => {
        if (req.context.token.role !== constants.roles.admin) {
          return bluebird.reject(new errors.Unauthorized());
        }
      })
      .nodeify(next)
    ;
  }

  function onlyUser(req, res, next) {
    return validateToken(req)
      .then(() => {
        if (req.context.token.username !== req.params.username && req.context.token.role !== constants.roles.admin) {
          return bluebird.reject(new errors.Unauthorized());
        }
      })
      .nodeify(next)
    ;
  }

  function validateToken(req) {
    // get token from Authorization header
    const token = req.headers.authorization;

    // if there is no token, return an error
    if (!token) {
      return bluebird.reject(new errors.Forbidden('No se encuentra el token'));
    }

    // decode token
    // verifies secret and checks expiration
    return bluebird.promisify(jwt.verify, jwt)(token, config.auth.secret, {ignoreNotBefore: true})
      .then(decoded => {
        // if everything is good, save to request context for use in other routes
        req.context.token = decoded;
      })
      .catch(err => bluebird.reject(new errors.BadRequest(err)))
    ;
  }
};
