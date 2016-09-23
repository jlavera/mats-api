import _           from 'lodash';
import neo4jDriver from 'neo4j-driver';

module.exports = function neo4j(
  config
) {
  const driver = neo4jDriver.v1.driver(
    config.neo4j.uri,
    neo4jDriver.v1.auth.basic(
      config.neo4j.username, config.neo4j.password
    )
  );

  return ({
    run,
    runSingle,
    runMultiple
  });

  function mergeProperties(record) {
    return _.merge.apply(this, _.map(record._fields, 'properties'))
  }

  function runSingle(query, params) {
    return run(query, params)
      .then(result => {
        if (result.records.length) {
          return mergeProperties(result.records[0]);
        }

        return undefined;
      })
    ;
  }

  function runMultiple(query, params) {
    return run(query, params)
      .then(result => result.records.map(mergeProperties))
    ;
  }

  function run(query, params) {
    var session = driver.session();

    return session
      .run(query, params)
      .then(results => {
        // Completed!
        session.close();

        return results;
      })
    ;
  }
};
