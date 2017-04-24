import express from 'express';
import bodyParser from 'body-parser';

module.exports = function $app(
  apiV1Router,
  errorCoercingMiddleware,
  errorLoggingMiddleware,
  errorMiddleware,
  winston2LoggerMiddleware
) {
  const app = express();

  // ---

  app.use(winston2LoggerMiddleware());
  app.use(bodyParser.json());

  // ---

  app.use('/public', express.static('public'))

  app.use(apiV1Router);

  // ---

  app.use(errorLoggingMiddleware);
  app.use(errorCoercingMiddleware);
  app.use(errorMiddleware);

  return app;
};
