import { MongoClient } from 'mongodb';
import bluebird        from 'bluebird';

module.exports = function mongoDb(
  config
) {
  let getDb = MongoClient.connect(`${config.mongoDb.uri}`, { useNewUrlParser: true })
    .then(client => {
      console.log('Connected successfully to server');

      return client.db(config.mongoDb.dbName);
    })
    .catch(err => {
      console.log('error connecting mongodb: ', err);
    })
  ;

  return ({
    run,
    runOne,
    runMultiple
  });

  function run(query) {
    return bluebird.resolve(getDb.then(query));
  }

  function runOne(collection, filter, projection) {
    const options = { projection };

    return bluebird.resolve(getDb.then(db => db.collection(collection).findOne(filter || {}, options)));
  }

  function runMultiple(collection, filter, projection) {
    return bluebird.resolve(getDb.then(db => db.collection(collection).find(filter || {}).project(projection || {}).toArray()));
  }
};
