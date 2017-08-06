import _        from 'lodash';
import bluebird from 'bluebird';
import errors   from 'http-errors';

// ---

module.exports = function usersService(
  container,
  hashingService,
  usersRepository
) {
  return {
    createUser,
    del,
    get,
    getAll
  };

  // ---

  /**
   * Creates an user.
   *
   * @returns {Promise}
   */
  function createUser(context, username, password) {
    if (!username || !password) {
      return bluebird.reject(new errors.BadRequest('Nombre de usuario y contraseña no pueden ser vacíos.'));
    }

    return usersRepository.get(username)
      .then(user => {
        if (!_.isEmpty(user)) {
          return bluebird.reject(new errors.Conflict('El nombre de usuario está tomado.'));
        }

        return hashingService.hash(password);
      })
      .tap(hashedPassword => {
        return usersRepository.createUser(username, hashedPassword);
      })
      .then(() => {
        return container.get('authenticationService').createToken(context, username, password);
      })
    ;
  }

  /**
   * Deletes an user.
   *
   * @returns {Promise}
   */
  function del(context, username) {
    return usersRepository.del(username);
  }

  /**
   * Retrieves a specific user.
   *
   * @returns {Promise}
   */
  function get(context, username, withPassword) {
    return usersRepository.get(username, withPassword)
      .then(user => {
        if (!user) {
          return bluebird.reject(new errors.NotFound('Usuario'));
        }

        return user;
      })
    ;
  }

  /**
   * Retrieves all existing users.
   *
   * @returns {Promise}
   */
  function getAll(context) {
    return usersRepository.getAll();
  }
};
