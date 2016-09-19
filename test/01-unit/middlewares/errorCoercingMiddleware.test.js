import { promisify }        from 'bluebird';
import errors               from 'http-errors';

import testContainerFactory from '../../support/testContainerFactory';

// ---

const container = testContainerFactory.createContainer();

// ---

describe('errorCoercingMiddleware', container.describe(() => {
  let errorCoercingMiddleware;

  beforeEach(function initErrorCoercingMiddleware() {
    errorCoercingMiddleware = this.container.get('errorCoercingMiddleware');
  });

  it('should coerce osprey ramlNotFound error to NotFoundError', () => {
    const error = new Error('Oops!');
    error.ramlNotFound = true;

    return promisify(errorCoercingMiddleware)(error, /* req */{}, /* res */{})
      .should.be.rejectedWith(errors.NotFound, 'Oops!')
      ;
  });

  it('should coerce osprey ramlValidation error to BadRequestError', () => {
    const error = new Error('Oops!');
    error.ramlValidation = true;
    error.requestErrors  = [];

    return promisify(errorCoercingMiddleware)(error, /* req */{}, /* res */{})
      .should.be.rejectedWith(errors.BadRequest, 'Oops!')
      ;
  });

  it('should remove schemas from errors in ramlValidationErrors', () => {
    const error = new Error('Oops!');
    error.ramlValidation = true;
    error.requestErrors = [{
      schema:    {},
      otherData: '1'
    }, {
      schema:    {},
      otherData: '2'
    }];

    return promisify(errorCoercingMiddleware)(error, /* req */{}, /* res */{})
      .catch((err) => {
        err.details.should.eql([{ otherData: '1' }, { otherData: '2' }]);
        err.message.should.eql('Oops!');
        err.status.should.eql(400);
      })
      ;
  });
}));
