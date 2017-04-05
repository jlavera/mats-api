import _        from 'lodash';
import bluebird from 'bluebird';

// ---

module.exports = function usersRepository(
  neo4j
) {
  return {
    createUser,
    del,
    get,
    getAll
  };

  // ---

  /**
   * Creates an user
   *
   * @returns {Promise}
   */
  function createUser(username, password) {
    return neo4j.runEmpty('CREATE (user:User {username: {username}, password: {password}})', {username: username, password: password});
  }

  /**
   * Deletes an user
   *
   * @returns {Promise}
   */
  function del(username) {
    return neo4j.runEmpty('MATCH (user:User {username: {username}}) DELETE user', {username: username});
  }

  /**
   * Get
   *
   * @returns {Promise}
   */
  function get(username) {
    return neo4j.runSingle(
      'MATCH (user:User {username: {username}}) RETURN user.username as username',
      {username: username},
      item => _.zipObject(item.keys, item._fields)
    );
  }

  /**
   * Get
   *
   * @returns {Promise}
   */
  function getAll() {
    return neo4j.runMultiple(
      'MATCH (user:User) RETURN user.username as username',
      {},
      item => _.zipObject(item.keys, item._fields)
    );
  }
};
