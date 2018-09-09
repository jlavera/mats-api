import expressify from 'expressify';

// ---

module.exports = function careersController(
  careersService
) {
  return expressify({
    get,
    getAll
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
};
