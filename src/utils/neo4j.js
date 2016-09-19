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

  function runSingle(query, params) {
    return run(query, params)
      // .then(a => {console.log(JSON.stringify(a, null, 2)); return a;})
      .then(result => result.records.length ? result.records[0]._fields[0].properties : undefined)
    ;
  }

  function runMultiple(query, params) {
    return run(query, params)
      .then(result => result.records.map(record => record._fields[0].properties))
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
