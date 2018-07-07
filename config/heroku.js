module.exports = {
  neo4j: {
    uri:      process.env.GRAPHENEDB_BOLT_URL,
    username: process.env.GRAPHENEDB_BOLT_USER,
    password: process.env.GRAPHENEDB_BOLT_PASSWORD
  },
  auth: {
    secret:   process.env.AUTH_SECRET
  }
};
