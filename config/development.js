import _    from 'lodash';

// ---

module.exports = {
  express: {
    port: _.get(process.env, 'PORT', 8088)
  },
  neo4j: {
    uri: 'bol://ec2-52-67-36-124.sa-east-1.compute.amazonaws.com:7687',
    username: 'neo4j',
    password: 'mats'
  }
};
