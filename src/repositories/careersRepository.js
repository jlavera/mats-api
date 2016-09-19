import bluebird from 'bluebird';

// ---

module.exports = function careersRepository(
  neo4j
) {
  return {
    get,
    getAll
  };

  // ---

  /**
   * Get
   *
   * @returns {Promise}
   */
  function get(code) {
    return neo4j.runSingle("MATCH (career:Career {code: {code}}) RETURN career", {code: code});
  }

  /**
   * Get
   *
   * @returns {Promise}
   */
  function getAll() {
    return neo4j.runMultiple("MATCH (career:Career) RETURN career");
  }

};
