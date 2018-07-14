import path from 'path';
import _    from 'lodash';

// ---

const ROOT = path.join(__dirname, '..');
const ENV  = process.env.NODE_ENV || 'development';

// ---

module.exports = {
  neo4j: {
    uri:      'localhost:7474',
    username: 'neo4j',
    password: 'neo4j'
  }
};
