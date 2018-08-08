import expressify from 'expressify';

// ---

module.exports = function careersController(
  careersService
) {
  return expressify({
    get,
    getAll,
    getCourses,
    getOptionals
  });

  // ---

  /**
   * Retrieves a specific career.
   *
   * @returns {Promise}
   */
  function get(req, res) {
    return careersService.get(req.context, '' + req.params.careerCode)
      .then(response => res.json(response))
    ;
  }

  /**
   * Retrieves all existing careers.
   *
   * @returns {Promise}
   */
  function getAll(req, res) {
    return careersService.getAll(req.context)
      .then(response => res.json(response))
    ;
  }

  /**
   * Retrieves courses for a career.
   *
   * @returns {Promise}
   */
  function getCourses(req, res) {
    return careersService.getCourses(req.context, '' + req.params.careerCode)
      .then(response => res.json(response))
    ;
  }

  /**
   * Retrieves optional courses for a career.
   *
   * @returns {Promise}
   */
  function getOptionals(req, res) {
    return careersService.getOptionals(req.context, '' + req.params.careerCode)
      .then(response => res.json(response))
    ;
  }
};
