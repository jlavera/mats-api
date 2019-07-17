import express from 'express';

module.exports = function apiV1Router(
  config,
  authorizationMiddleware,
  ospreyMiddleware,

  authenticationController,
  careersController,
  statusController,
  usersController
) {
  // eslint-disable-next-line new-cap
  return express.Router().use(config.apis.v1.baseUri, express.Router()
    // ---
    // OSPREY
    // ---
    .use(ospreyMiddleware(config.apis.v1.raml, {
      disableErrorInterception: true,
      server:                   {
        limit: config.apis.v1.jsonMaxSize
      }
    }))

    // ---
    // GENERAL
    // ---
    .use(initContext)

    // ---
    // ROUTES
    // ---

    // Status endpoint
    .get('/status', statusController.get)

    // Auth endpoint
    .post('/auth', authenticationController.createToken)

    // Static endpoints
    .get('/careers',                       authorizationMiddleware.anonymous, careersController.getAll)
    .get('/careers/:careerCode',           authorizationMiddleware.anonymous, careersController.get)

    // Users endpoints
    .get(   '/users',       authorizationMiddleware.onlyAdmin, usersController.getAll)
    .post(  '/users',       authorizationMiddleware.anonymous, usersController.createUser)
    .get(   '/users/:code', authorizationMiddleware.onlyUser,  usersController.get)
    .delete('/users/:code', authorizationMiddleware.onlyUser,  usersController.del)

    .post(  '/users/:code/signed',   authorizationMiddleware.onlyUser,  usersController.signed)
    .post(  '/users/:code/approved', authorizationMiddleware.onlyUser,  usersController.approved)
    .post(  '/users/:code/pending',  authorizationMiddleware.onlyUser,  usersController.pending)
  );
};

function initContext(req, res, next) {
  // eslint-disable-next-line no-param-reassign
  req.context = {};
  next();
}
