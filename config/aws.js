import path from 'path';
import _    from 'lodash';

// ---

const ROOT = path.join(__dirname, '..');
const ENV  = process.env.NODE_ENV || 'development';

// ---

module.exports = {
  neo4j: {
    uri:      'bolt://localhost:7687',
    username: 'neo4j',
    password: 'mats'
  }
};
