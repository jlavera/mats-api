import * as path  from 'path';
import express    from 'express';
import bodyParser from 'body-parser';
import favicon    from 'serve-favicon';

import * as webpackDevMiddleware from 'webpack-dev-middleware';
import * as webpackHotMiddleware from 'webpack-hot-middleware';

// import * as webpack from 'webpack';
// import * as config from '../webpack.config';

// const compiler = webpack.default(config);

module.exports = function $app(
  apiV1Router,
  errorCoercingMiddleware,
  errorLoggingMiddleware,
  errorMiddleware,
  winston2LoggerMiddleware
) {
  const app = express();
  const distPath = process.env.NODE_ENV === 'aws' ? '/..' : '/../dist';

  // --- FRONTEND

  // app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  // app.use(webpackHotMiddleware(compiler));

  app.use(express.static(path.resolve(__dirname + distPath)));

  // app.use(express.static(path.resolve('/../public')));

  app.get('/', function(request, response) {
    response.sendFile(path.resolve(__dirname + `${distPath}/index.html`))
  });

  // --- API

  app.use(winston2LoggerMiddleware());
  app.use(bodyParser.json());

  // ---

  // app.use(favicon(`${__dirname}/../public/favicon.ico`));

  app.use(apiV1Router);

  // ---

  app.use(errorLoggingMiddleware);
  app.use(errorCoercingMiddleware);
  app.use(errorMiddleware);

  return app;
};
