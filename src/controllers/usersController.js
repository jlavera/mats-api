import expressify from 'expressify';

// ---

module.exports = function usersController(
  usersService
) {
  return expressify({
    createUser,
    del,
    get,
    getAll,

    signed,
    approved,
    pending
  });

  // ---

  /**
   * Creates an user.
   *
   * @returns {Promise}
   */
  function createUser(req, res) {
    return usersService.createUser(req.context, +req.body.code, '' + req.body.password)
      .then(() => res.status(201).json())
    ;
  }

  /**
   * Deletes an user.
   *
   * @returns {Promise}
   */
  function del(req, res) {
    return usersService.del(req.context, +req.params.code)
      .then(() => res.status(204).json())
    ;
  }

  /**
   * Retrieves a specific user.
   *
   * @returns {Promise}
   */
  function get(req, res) {
    return usersService.get(req.context, +req.params.code)
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

  function signed(req, res) {
    return usersService.signed(req.context, +req.params.code, req.body)
      .then(response => res.json(response))
    ;
  }


  function approved(req, res) {
    return usersService.approved(req.context, +req.params.code, req.body)
      .then(response => res.json(response))
    ;
  }

  function pending(req, res) {
    return usersService.pending(req.context, +req.params.code, req.body)
      .then(response => res.json(response))
    ;
  }
};
