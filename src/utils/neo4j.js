import bluebird    from 'bluebird';
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
    runEmpty,
    runSingle,
    runMultiple
  });

  function mergeProperties(record) {
    return _.merge.apply(this, _.map(record._fields, 'properties'));
  }

  function runEmpty(query, params) {
    return run(query, params)
      .then(bluebird.resolve)
      .return(undefined)
    ;
  }

  function runSingle(query, params, mapper) {
    return run(query, params)
      .then(result => {
        if (result.records.length) {
          return (mapper ? mapper : mergeProperties)(result.records[0]);
        }

        return undefined;
      })
      .then(bluebird.resolve)
    ;
  }

  function runMultiple(query, params, mapper) {
    return run(query, params)
      .then(result => result.records.map(mapper ? mapper : mergeProperties))
    ;
  }

  function run(query, params) {
    var session = driver.session();

    return bluebird.resolve(session
      .run(query, params)
      .then(results => {
        // Completed!
        session.close();

        return results;
      })
    );
  }
};
