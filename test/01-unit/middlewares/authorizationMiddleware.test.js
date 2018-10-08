import testContainerFactory from '../../support/testContainerFactory';

import _                    from 'lodash';
import errors               from 'http-errors';

// ---

const container = testContainerFactory.createContainer();

// ---

describe('authorizationMiddleware', container.describe(() => {
  let authorizationMiddleware;
  let config;
  let constants;
  let jwt;
  let jwtVerifyCB;
  let next;

  let rejection;

  beforeEach(function initErrorLoggingMiddleware() {
    authorizationMiddleware = this.container.get('authorizationMiddleware');
    config                  = this.container.get('config');
    constants               = this.container.get('constants');
    jwt                     = this.container.get('jwt');
    next                    = this.sinon.stub();
  });

  describe('for anonymous', () => {
    let method;

    beforeEach(function () {
      method = authorizationMiddleware.anonymous;
    });

    describe('when authorization header is missing', () => {
      beforeEach(function () {
        return method(buildRequest(), {}, next);
      });

      it('should not fail', () => {
        next.should.have.been.calledOnce;
      });
    });

    describe('when authorization header present', () => {
      beforeEach(function () {
        return method(buildRequest('Bearer token'), {}, next);
      });

      it('should not fail', () => {
        next.should.have.been.calledOnce;
      });
    });
  });

  describe('for everyone', () => {
    let method;

    beforeEach(function before() {
      method = authorizationMiddleware.everyone;
    });

    describe('when authorization header is missing', () => {
      beforeEach(function () {
        return (rejection = method(buildRequest(), {}, next)).catch(_.noop);
      });

      it('should fail', () => {
        rejection.should.be.rejectedWith(errors.Forbidden);
        next.should.have.been.calledOnce;
      });
    });

    describe('when authorization header present', () => {
      let req;

      beforeEach(function () {
        req = buildRequest('Bearer token');
      })

      describe('with valid token', () => {
        let decoded;

        beforeEach(function () {
          decoded     = {
            user: 'user',
            role: 'role'
          };
          jwtVerifyCB = this.sinon.spy((token, secret, opts, callback) => callback(null, decoded));

          this.sinon.stub(jwt, 'verify', jwtVerifyCB);

          return method(req, {}, next);
        });

        it('should verify with correct parameters', () => {
          jwtVerifyCB.should.have.been.calledWith('token', config.auth.secret, {ignoreNotBefore: true});
        });

        it('should add decoded token to request context', () => {
          req.context.token.should.deep.equals(decoded);
        });

        it('should not fail', () => {
          next.should.have.been.calledOnce;
        });
      });

      describe('with invalid token', () => {
        beforeEach(function () {
          jwtVerifyCB = this.sinon.spy((token, secret, opts, callback) => callback('error decoding'));

          this.sinon.stub(jwt, 'verify', jwtVerifyCB);

          return (rejection = method(req, {}, next)).catch(_.noop);
        });

        it('should verify with correct parameters', () => {
          jwtVerifyCB.should.have.been.calledWith('token', config.auth.secret, {ignoreNotBefore: true});
        });

        it('should not add decoded token to request context', () => {
          should.not.exist(req.context.token);
        });

        it('should fail', () => {
          rejection.should.have.been.rejectedWith(errors.BadRequest);
          next.should.have.been.calledOnce;
        });
      });
    });
  });

  function buildRequest(authHeader) {
    return {
      context: {},
      headers: {
        authorization: authHeader
      }
    };
  }
}));
