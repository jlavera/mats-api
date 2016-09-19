import _    from 'lodash';

// ---

module.exports = {
  express: {
    port: _.get(process.env, 'PORT', 8088)
  }
};
