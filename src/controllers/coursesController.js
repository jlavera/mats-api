import expressify from 'expressify';

// ---

module.exports = function coursesController(
  coursesService
) {
  return expressify({
    get,
    getAllByCareer,
    getInDependencies,
    getOutDependencies
  });

  // ---

  /**
   * Retrieves a specific course.
   *
   * @returns {Promise}
   */
  function get(req, res) {
    return coursesService.get(req.context, '' + req.params.careerCode, '' + req.params.courseCode)
      .then(response => res.json(response))
    ;
  }

  /**
   * Retrieves a list of courses corresponding to a career.
   *
   * @returns {Promise}
   */
  function getAllByCareer(req, res) {
    return coursesService.getAllByCareer(req.context, '' + req.params.careerCode)
      .then(response => res.json(response))
    ;
  }

  /**
   * Retrieves a list of courses needed to unblock this course.
   *
   * @returns {Promise}
   */
  function getInDependencies(req, res) {
    return coursesService.getInDependencies(req.context, '' + req.params.careerCode, '' + req.params.courseCode)
      .then(response => res.json(response))
    ;
  }

  /**
   * Retrieves a list of courses unblocked by this course.
   *
   * @returns {Promise}
   */
  function getOutDependencies(req, res) {
    return coursesService.getOutDependencies(req.context, '' + req.params.careerCode, '' + req.params.courseCode)
      .then(response => res.json(response))
    ;
  }
};
