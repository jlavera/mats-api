import bluebird from 'bluebird';

// ---

module.exports = function coursesRepository(
  neo4j
) {
  return {
    get,
    getAllByCareer,
    getInDependencies,
    getOutDependencies
  };

  // ---

  /**
   * Get
   *
   * @returns {Promise}
   */
  function get(careerCode, courseCode) {
    return neo4j.runSingle(`
      MATCH (course: Course {code: {courseCode}})-[presentIn :PRESENT_IN]->(career: Career {code: {careerCode}})
      RETURN course, presentIn;`,
      {careerCode: careerCode, courseCode: courseCode}
    );
  }

  /**
   * Get
   *
   * @returns {Promise}
   */
  function getAllByCareer(careerCode) {
    return neo4j.runMultiple(`
      MATCH (course: Course)-[presentIn :PRESENT_IN]->(career: Career {code: {careerCode}})
      RETURN course, presentIn`,
      {careerCode: careerCode}
    );
  }

  /**
   * Get
   *
   * @returns {Promise}
   */
  function getInDependencies(careerCode, courseCode) {
    return neo4j.runMultiple(`
      MATCH (course1: Course {code: {courseCode} })-[:DEPENDS_ON]->(course2: Course)
      MATCH (course2: Course)-[:PRESENT_IN]->(career: Career {code: {careerCode} })
      RETURN course2`,
      {careerCode: careerCode, courseCode: courseCode}
    );
  }

  /**
   * Get
   *
   * @returns {Promise}
   */
  function getOutDependencies(careerCode, courseCode) {
    return neo4j.runMultiple(`
      MATCH (course1: Course {code: {courseCode} })<-[:DEPENDS_ON]-(course2: Course)
      MATCH (course2: Course)-[:PRESENT_IN]->(career: Career {code: {careerCode} })
      RETURN course2`,
      {careerCode: careerCode, courseCode: courseCode}
    );
  }
};
