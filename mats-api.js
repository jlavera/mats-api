import configurationFactory from './src/config';
import containerFactory     from './src/containerFactory';

// ---

if (require.main === module) {
  main();
}

// ---

function main() {
  containerFactory.createContainer().resolve((app, config, logger) => {
    app.listen(config.express.port, config.express.host, () => {
      logger.info('listening on %s:%s ...', config.express.host, config.express.port);
    });
  });
}
