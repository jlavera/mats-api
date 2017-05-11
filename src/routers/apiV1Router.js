import express from 'express';

module.exports = function apiV1Router(
  config,
  ospreyMiddleware,

  careersController,
  coursesController,
  statusController
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

    .get('/careers',                                                 careersController.getAll)
    .get('/careers/:careerCode',                                     careersController.get)
    .get('/careers/:careerCode/courses',                             coursesController.getAllByCareer)
    .get('/careers/:careerCode/courses/:courseCode',                 coursesController.get)
    .get('/careers/:careerCode/courses/:courseCode/inDependencies',  coursesController.getInDependencies)
    .get('/careers/:careerCode/courses/:courseCode/outDependencies', coursesController.getOutDependencies)

    .get('/careers/:careerCode/tree',        careersController.getTree)
    .get('/careers/:careerCode/reverseTree', careersController.getReverseTree)
  );
};

function initContext(req, res, next) {
  // eslint-disable-next-line no-param-reassign
  req.context = {};
  next();
}
