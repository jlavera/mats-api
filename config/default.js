import path from 'path';
import _    from 'lodash';

// ---

const ROOT = path.join(__dirname, '..');
const ENV  = process.env.NODE_ENV || 'development';

// ---

module.exports = {
  apis: {
    v1: {
      baseUri:     '/api/v1',
      raml:        path.join(ROOT, '/assets/raml/api.v1.raml'),
      jsonMaxSize: '400kb'
    }
  },

  express: {
    host: '0.0.0.0',
    port: _.get(process.env, 'PORT', 8080)
  },

  logger: {
    console: {
      enabled:     true,
      level:       'debug',
      timestamp:   true,
      prettyPrint: true
    },
    syslog: {
      enabled:  false,
      protocol: 'udp4',
      path:     '/dev/log',
      app_name: 'mats-api',
      facility: 'local6'
    }
  },

  neo4j: {
    uri:      'bolt://hobby-lgfhfaeefcomgbkeafoejnnl.dbs.graphenedb.com:24786',
    username: 'careersdb',
    password: 'CsIrxOv1MXT2DLmVxde8'
  },

  newRelic: {
    appName:      `Microservice Template (${ENV})`,
    enabled:      _.get(process.env, 'NEW_RELIC_ENABLED', false),
    licenseKey:   _.get(process.env, 'NEW_RELIC_LICENSE_KEY'),
    noConfigFile: _.get(process.env, 'NEW_RELIC_NO_CONFIG_FILE', true)
  }
};
