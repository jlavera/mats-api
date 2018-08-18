import * as path  from 'path';
import express    from 'express';
import bodyParser from 'body-parser';

module.exports = function $app(
  apiV1Router,
  errorCoercingMiddleware,
  errorLoggingMiddleware,
  errorMiddleware,
  winston2LoggerMiddleware
) {
  const app = express();
  const distPath = process.env.NODE_ENV === 'aws' ? '/..' : '/../dist';

  // --- API

  app.use(winston2LoggerMiddleware());
  app.use(bodyParser.json());

  // ---

  app.use(apiV1Router);

  // ---

  app.use(errorLoggingMiddleware);
  app.use(errorCoercingMiddleware);
  app.use(errorMiddleware);

  return app;
};
