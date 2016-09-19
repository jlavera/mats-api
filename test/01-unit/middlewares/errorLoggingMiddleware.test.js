import testContainerFactory from '../../support/testContainerFactory';

// ---

const container = testContainerFactory.createContainer();

// ---

describe('errorLoggingMiddleware', container.describe(() => {
  let errorLoggingMiddleware;
  let logger;

  beforeEach(function initErrorLoggingMiddleware() {
    errorLoggingMiddleware = this.container.get('errorLoggingMiddleware');
    logger                 = this.sinon.stub(this.container.get('logger'));
  });

  it('should log error', (done) => {
    const error = new Error('Oops!');
    errorLoggingMiddleware(error, /* req */{}, /* res */{}, /* next */() => {
      logger.error.should.have.been.calledWith(error);
      done();
    });
  });

  it('should pass control to next handler', (done) => {
    const error = new Error('Oops!');
    errorLoggingMiddleware(error, /* req */{}, /* res */{}, /* next */ ($error) => {
      should.exist($error);
      $error.should.be.equal(error);

      done();
    });
  });
}));
