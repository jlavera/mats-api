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
    return neo4j.runEmpty(
      'CREATE (user:User {username: {username}, password: {password}, role: "USER"})',
      {username: username, password: password}
    );
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
  function get(username, withPassword) {
    return neo4j.runSingle(
      'MATCH (user:User {username: {username}}) RETURN user',
      {username: username}
    )
      .then(user => withPassword ? user : _.omit(user, 'password'))
    ;
  }

  /**
   * Get
   *
   * @returns {Promise}
   */
  function getAll() {
    return neo4j.runMultiple(
      'MATCH (user:User) RETURN user',
      {}
    )
      .map(user => _.omit(user, 'password'))
    ;
  }
};
