import _        from 'lodash';
import bluebird from 'bluebird';

// ---

module.exports = function careersRepository(
  neo4j
) {
  return {
    get,
    getAll,
    getTree
  };

  // ---

  /**
   * Get
   *
   * @returns {Promise}
   */
  function get(code) {
    return neo4j.runSingle('MATCH (career:Career {code: {code}}) RETURN career', {code: code});
  }

  /**
   * Get
   *
   * @returns {Promise}
   */
  function getAll() {
    return neo4j.runMultiple('MATCH (career:Career) RETURN career');
  }

  /**
   * Get
   *
   * @returns {Promise}
   */
  function getTree(code) {
    return neo4j.runMultiple(`
      MATCH
      	(c1:Course)-[:PRESENT_IN]->(Career {code: {code}}),
      	(c1)-[d:DEPENDS_ON]->(c2)
      RETURN c1.code as code, collect({type: d.requirement, code: c2.code}) as dependencies;`,
      {code: code},
      item => _.zipObject(item.keys, item._fields)
    );
  }
};
