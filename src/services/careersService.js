import bluebird from 'bluebird';
import errors   from 'http-errors';

// ---

module.exports = function careersService(
  careersRepository
) {

  return {
    get,
    getAll,
    getTree
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
   * Retrieves the dependency tree of a career
   *
   * @returns {Promise}
   */
  function getTree(context, careerCode) {
    return careersRepository.getTree(careerCode);
  }
};
