const bluebird = require('bluebird');
const errors   = require('http-errors');

module.exports = function authorizationMiddleware(
  config,
  constants,
  jwt
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
    const header = req.headers.authorization;

    if (!header) {
      return bluebird.reject(new errors.Forbidden('No se encuentra el token'));
    }

    const [prefix, token] = header.split(' ');
    if (prefix.toLowerCase() !== 'bearer' || !token) {
      return bluebird.reject(new errors.BadRequest('Token inválido'));
    }

    return bluebird.promisify(jwt.verify, jwt)(token, config.auth.secret, {ignoreNotBefore: true})
      .then(decoded => {
        // if everything is good, save to request context for use in other routes
        req.context.token = decoded;
      })
      .catch(err => bluebird.reject(new errors.BadRequest(err)))
    ;
  }
};
