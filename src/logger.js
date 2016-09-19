import winston from 'winston';

// ---

module.exports = function loggerDependency(config) {
  const logger     = new winston.Logger();
  const transports = [
    {
      type:  'console',
      adder: addConsoleTransport
    },
    {
      type:  'syslog',
      adder: addSysLogTransport
    }
  ];

  transports.forEach((transport) => {
    if ((config.logger[transport.type] || {}).enabled) {
      transport.adder(config, logger);
    }
  });

  return logger;
};

// ---

function addConsoleTransport(config, logger) {
  logger.add(winston.transports.Console, config.logger.console);
}

function addSysLogTransport(config, logger) {
  require('winston-syslog').Syslog; // eslint-disable-line

  // We monkey-patch syslog transport to properly
  // map winston's `warn` level to syslog's `warning` level
  // which is really silly and should be done by transport
  // itself, but for now we're stuck with this.

  const transport    = new winston.transports.Syslog(config.logger.syslog);
  const transportLog = transport.log;

  transport.log = function log() {
    if (arguments[0] === 'warn') { // eslint-disable-line
      arguments[0] = 'warning'; // eslint-disable-line
    }

    // eslint-disable-next-line
    return transportLog.apply(transport, arguments);
  };

  logger.add(transport, null, true);
}
