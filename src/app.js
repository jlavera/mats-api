import express    from 'express';
import bodyParser from 'body-parser';
import favicon    from 'serve-favicon';


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

  app.use(favicon(`${__dirname}/../public/images/fav.png`));

  app.use(apiV1Router);

  // ---

  app.use(errorLoggingMiddleware);
  app.use(errorCoercingMiddleware);
  app.use(errorMiddleware);

  return app;
};
