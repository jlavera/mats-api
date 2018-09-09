import _        from 'lodash';
import bluebird from 'bluebird';
import errors   from 'http-errors';

// ---

module.exports = function usersService(
  careersService,
  container,
  hashingService,
  usersRepository
) {
  return {
    createUser,
    del,
    get,
    getAll,

    signed,
    approved,
    pending
  };

  // ---

  /**
   * Creates an user.
   *
   * @returns {Promise}
   */
  function createUser(context, code, password) {
    if (!code || !password) {
      return bluebird.reject(new errors.BadRequest('Legajo y contraseña no pueden estar vacíos.'));
    }

    return usersRepository.get(context, code)
      .then(user => {
        if (!_.isEmpty(user)) {
          return bluebird.reject(new errors.Conflict('El legajo ya fue usado.'));
        }

        return hashingService.hash(password);
      })
      .then(hashedPassword => usersRepository.createUser(context, code, hashedPassword))
      .then(() => ({}))
    ;
  }

  /**
   * Deletes an user.
   *
   * @returns {Promise}
   */
  function del(context, code) {
    return usersRepository.del(context, code);
  }

  /**
   * Retrieves a specific user.
   *
   * @returns {Promise}
   */
  function get(context, code, withPassword) {
    return usersRepository.get(context, code, !!withPassword)
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

  function signed(context, userCode, codes) {
    return careersService.getCoursesByCode(context, codes)
      .tap(checkExistingCodes.bind(null, codes))
      .then(() => usersRepository.removeFromApproved(context, userCode, codes))
      .then(() => usersRepository.addToSigned(context, userCode, codes))
    ;
  }

  function approved(context, userCode, codes) {
    return careersService.getCoursesByCode(context, codes)
      .tap(checkExistingCodes.bind(null, codes))
      .then(() => usersRepository.removeFromSigned(context, userCode, codes))
      .then(() => usersRepository.addToApproved(context, userCode, codes))
    ;
  }

  function pending(context, userCode, codes) {
    return careersService.getCoursesByCode(context, codes)
      .tap(checkExistingCodes.bind(null, codes))
      .then(() => usersRepository.removeFromSigned(context, userCode, codes))
      .then(() => usersRepository.removeFromApproved(context, userCode, codes))
    ;
  }

  // ---

  function checkExistingCodes(codes, coursesFound) {
    const courses = [];

    coursesFound.forEach(course => {
      courses.push(course.code);
    });

    // If any code is not found as course => not found
    codes.forEach(code => {
      if (courses.indexOf(code) === -1) {
        throw new errors.NotFound(`Materia ${code}`);
      }
    });
  }
};
