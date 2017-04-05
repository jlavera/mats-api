import expressify from 'expressify';

// ---

module.exports = function usersController(
  usersService
) {
  return expressify({
    createUser,
    del,
    get,
    getAll
  });

  // ---

  /**
   * Creates an user.
   *
   * @returns {Promise}
   */
  function createUser(req, res) {
    return usersService.createUser(req.context, '' + req.params.username, '' + req.body.password)
      .then(response => res.json(response))
    ;
  }

  /**
   * Deletes an user.
   *
   * @returns {Promise}
   */
  function del(req, res) {
    return usersService.del(req.context, '' + req.params.username)
      .then(() => res.status(204))
    ;
  }

  /**
   * Retrieves a specific user.
   *
   * @returns {Promise}
   */
  function get(req, res) {
    return usersService.get(req.context, '' + req.params.username)
      .then(response => res.json(response))
    ;
  }

  /**
   * Retrieves all existing users.
   *
   * @returns {Promise}
   */
  function getAll(req, res) {
    return usersService.getAll(req.context)
      .then(response => res.json(response))
    ;
  }
};
