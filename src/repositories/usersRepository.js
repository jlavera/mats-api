import _        from 'lodash';
import bluebird from 'bluebird';

// ---

module.exports = function usersRepository(
  mongoDb
) {
  const collection = 'users';

  return {
    createUser,
    del,
    get,
    getAll,

    addToSigned,
    addToApproved,
    removeFromSigned,
    removeFromApproved
  };

  // ---

  /**
   * Creates an user
   *
   * @returns {Promise}
   */
  function createUser(context, code, password) {
    return mongoDb.run(db => db.collection(collection).insert({
      code:     code,
      password: password,
      role:     'USER',
      signed:   [],
      approved: []
    }));
  }

  /**
   * Deletes an user
   *
   * @returns {Promise}
   */
  function del(context, code) {
    return mongoDb.run(db => db.collection(collection).deleteOne({ code: code }));
  }

  /**
   * Get
   *
   * @returns {Promise}
   */
  function get(context, code, withPassword) {
    const projection = { _id: 0 };

    if (!withPassword) {
      projection.password = 0;
    }

    return mongoDb.runOne(collection, { code: code }, projection);
  }

  /**
   * Get
   *
   * @returns {Promise}
   */
  function getAll(context) {
    return mongoDb.runMultiple(collection, {}, { _id: 0, code: 1 });
  }

  function addToSigned(context, userCode, codes) {
    return mongoDb.run(db => db.collection(collection).update({ code: userCode }, { $addToSet: { signed: { $each: codes } } }));
  }

  function addToApproved(context, userCode, codes) {
    return mongoDb.run(db => db.collection(collection).update({ code: userCode }, { $addToSet: { approved: { $each: codes } } }));
  }

  function removeFromSigned(context, userCode, codes) {
    return mongoDb.run(db => db.collection(collection).update({ code: userCode }, { $pullAll: { signed: codes } }));
  }

  function removeFromApproved(context, userCode, codes) {
    return mongoDb.run(db => db.collection(collection).update({ code: userCode }, { $pullAll: { approved: codes } }));
  }
};
