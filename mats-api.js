import configurationFactory from './src/config';
import containerFactory     from './src/containerFactory';

// ---

if (require.main === module) {
  main();
}

// ---

function main() {
  const newConfig = configurationFactory();

  if (newConfig.newRelic.enabled) {
    process.env.NEW_RELIC_NO_CONFIG_FILE = newConfig.newRelic.noConfigFile;
    process.env.NEW_RELIC_LICENSE_KEY    = newConfig.newRelic.licenseKey;
    process.env.NEW_RELIC_APP_NAME       = newConfig.newRelic.appName;
    // eslint-disable-next-line global-require
    require('newrelic');
  }

  containerFactory.createContainer().resolve((app, config, logger) => {
    app.listen(config.express.port, config.express.host, () => {
      logger.info('listening on %s:%s ...', config.express.host, config.express.port);
    });
  });
}
