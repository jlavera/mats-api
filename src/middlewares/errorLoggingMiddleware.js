module.exports = function errorLoggingMiddleware(logger) {
  return function innerErrorLoggingMiddleware(err, req, res, next) {
    logger.error(err);
    next(err);
  };
};
