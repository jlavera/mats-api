import bluebird from 'bluebird';
import errors   from 'http-errors';

// ---

module.exports = function careersService(
  careersRepository
) {
  return {
    get,
    getAll,
    getCourses,
    getCoursesByCode,
    getOptionals
  };

  // ---

  /**
   * Retrieves a specific career.
   *
   * @returns {Promise}
   */
  function get(context, careerCode) {
    return careersRepository.get(careerCode)
      .then(career => {
        if (!career) {
          return bluebird.reject(new errors.NotFound('Carrera'));
        }

        return career;
      })
    ;
  }

  /**
   * Retrieves all existing careers.
   *
   * @returns {Promise}
   */
  function getAll(context) {
    return careersRepository.getAll();
  }

  /**
   * Retrieves courses for a career.
   *
   * @returns {Promise}
   */
  function getCourses(context, careerCode) {
    return get(context, careerCode)
      .then(career => career.courses)
    ;
  }

  function getCoursesByCode(context, coursesCodes) {
    return careersRepository.getCoursesByCode(context, coursesCodes);
  }

  /**
   * Retrieves optional courses for a career.
   *
   * @returns {Promise}
   */
  function getOptionals(context, careerCode) {
    return get(context, careerCode)
      .then(career => career.optionals)
    ;
  }
};
