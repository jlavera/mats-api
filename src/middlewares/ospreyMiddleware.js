import osprey from 'osprey';

// ---

module.exports = function ospreyMiddleware() {
  return function innerOspreyMiddleware(pathToRamlFile, options) {
    let promise;
    return (req, res, next) => (
      (promise || (promise = osprey.loadFile(pathToRamlFile, options)))
        .then((middleware) => middleware(req, res, next))
        .catch(next)
    );
  };
};
