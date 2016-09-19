import morgan from 'morgan';

// ---

module.exports = function morgan2Logger(logger) {
  // eslint-disable-next-line no-shadow
  return function morgan2Logger() {
    return morgan('combined', {
      stream: {
        write: function write(line) {
          logger.info(line.trim());
        }
      }
    });
  };
};
