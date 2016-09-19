import bluebird             from 'bluebird';
import supertest            from 'supertest';
import testContainerFactory from '../support/testContainerFactory';

// ---

const container = testContainerFactory.createContainer();

// ---

describe('basicController', container.describe(() => {
  let request;

  beforeEach(function initStatusController() {
    this.container.resolve((app) => {
      request = supertest(app);
    });
  });

  describe('GET /api/v1/basic', () => {
    it('should respond with correct status and body', () => (
      bluebird.fromNode((callback) => {
        request.get('/api/v1/basic')
          .send()
          .expect(200, { method: 'get' })
          .end(callback)
        ;
      })
    ));
  });
}));
