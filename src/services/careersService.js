import bluebird from 'bluebird';
import errors   from 'http-errors';

// ---

module.exports = function careersService(
  careersRepository
) {

  return {
    get,
    getAll
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
};
