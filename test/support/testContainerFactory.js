import _                from 'lodash';
import containerFactory from '../../src/containerFactory';

module.exports                  = createContainer();
module.exports.createContainer  = createContainer;

function createContainer() {
  const container = containerFactory.createContainer();

  container.describe = function initDescribe(func) {
    beforeEach(function initBeforeEach() {
      /* jshint validthis:true */
      this.container = {
        mockedDependencies: {},
        getMock:            getMock.bind(this),
        get:                container.get.bind(container),
        register:           container.register.bind(container),
        resolve:            container.resolve.bind(container)
      };

      function getMock(target) {
        if (this.container.mockedDependencies[target]) {
          return this.container.mockedDependencies[target];
        }

        return this.container.mockedDependencies[target] = this.sinon.mock(container.get(target));
      }
    });

    afterEach(function initAfterEach() {
      _.forEach(this.container.mockedDependencies, (dep) => {
        dep.verify();
      });
    });

    return func;
  };

  return container;
}
