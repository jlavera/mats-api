import _      from 'lodash';
import errors from 'http-errors';

module.exports = function errorCoercingMiddleware() {
  const errorCoercingStrategies = [
    handledErrorIgnorer(),
    ospreyCoercer(),
    defaultClientErrorCoercer()
  ];

  return function innerErrorCoercingMiddleware(err, req, res, next) {
    _.findIndex(errorCoercingStrategies, ($strategy) => {
      if ($strategy.canHandle(err)) {
        // eslint-disable-next-line no-param-reassign
        err = $strategy.coerce(err);
        return true;
      }
      return false;
    });

    next(err);
  };

  function handledErrorIgnorer() {
    return {
      canHandle: (err) => err instanceof errors.HttpError,
      coerce:    (err) => err
    };
  }

  function ospreyCoercer() {
    return {
      canHandle: (err) =>  err.ramlNotFound || (err.ramlValidation && err.requestErrors) || (err.status === 413),
      coerce:    (err) => {
        if (err.ramlNotFound) {
          return new errors.NotFound(err.message);
        }

        if (err.status === 413) {
          return new errors.PayloadTooLarge(err.message);
        }

        // Remove schemas from outputs
        // eslint-disable-next-line no-param-reassign
        err.requestErrors.forEach((error) => delete error.schema);
        const httpError = new errors.BadRequest(err.message);
        httpError.details = err.requestErrors;

        return httpError;
      }
    };
  }

  function defaultClientErrorCoercer() {
    return {
      canHandle: (err) => err.status && err.message && err.name,
      coerce:    (err) => new errors.InternalServerError(err)
    };
  }
};
