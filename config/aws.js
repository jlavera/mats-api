import path from 'path';
import _    from 'lodash';

// ---

const ROOT = path.join(__dirname, '..');
const ENV  = process.env.NODE_ENV || 'development';

// ---

module.exports = {
  express: {
    host: '0.0.0.0',
    port: _.get(process.env, 'PORT', 3000)
  },
};
