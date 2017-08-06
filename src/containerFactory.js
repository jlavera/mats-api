import dependable from 'dependable';
import path       from 'path';

function createContainer() {
  const container = dependable.container();
  const entries   = [
    'app.js',
    'config.js',
    'controllers',
    'logger',
    'middlewares',
    'routers',
    'repositories',
    'services',
    'utils'
  ];

  entries.forEach(entry => container.load(path.join(__dirname, entry)));

  container.register('container', container);

  return container;
}

module.exports = {
  createContainer
};
