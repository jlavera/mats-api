const expressify = require('expressify');

module.exports = function authenticationController(
  authenticationService
) {
  return expressify({
    createToken
  });

  function createToken(req, res) {
    return authenticationService.createToken(req.context, req.body.code, req.body.password)
      .then(token => res.status(201).json(token))
    ;
  }
};
