import _        from 'lodash';
import bluebird from 'bluebird';

// ---

module.exports = function careersRepository(
  mongoDb
) {
  const collection = 'careers';

  return {
    get,
    getAll,
    getCoursesByCode
  };

  // ---

  /**
   * Get
   *
   * @returns {Promise}
   */
  function get(code) {
    return mongoDb.runOne(collection, { code: 'K' }, { _id: 0 });
  }

  /**
   * Get
   *
   * @returns {Promise}
   */
  function getAll() {
    return mongoDb.runMultiple(collection, {}, { _id: 0, code: 1 });
  }

  function getCoursesByCode(context, coursesCodes) {
    return mongoDb.run(db => {
      return db.collection(collection).aggregate([{
          $unwind: '$courses'
        }, {
          $match: {
            'courses.code': {
              $in: coursesCodes
            }
          }
        }])
      .toArray();
    })
    .map(doc => {
      return doc.courses;
    });
  }
};
