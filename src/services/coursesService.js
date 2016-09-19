import bluebird from 'bluebird';
import errors   from 'http-errors';

// ---

module.exports = function coursesService(
  coursesRepository
) {
  return {
    get,
    getAllByCareer,
    getInDependencies,
    getOutDependencies
  };

  // ---

  /**
   * Retrieves a specific course.
   *
   * @returns {Promise}
   */
  function get(context, careerCode, courseCode) {
    return coursesRepository.get(careerCode, courseCode);
  }

  /**
   * Retrieves all courses of a career.
   *
   * @returns {Promise}
   */
  function getAllByCareer(context, careerCode) {
    return coursesRepository.getAllByCareer(careerCode);
  }

  /**
   * Retrieves in dependencies of a course in a career.
   *
   * @returns {Promise}
   */
  function getInDependencies(context, careerCode, courseCode) {
    return coursesRepository.getInDependencies(careerCode, courseCode);
  }

  /**
   * Retrieves out dependencies of a course in a career.
   *
   * @returns {Promise}
   */
  function getOutDependencies(context, careerCode, courseCode) {
    return coursesRepository.getOutDependencies(careerCode, courseCode);
  }
};
