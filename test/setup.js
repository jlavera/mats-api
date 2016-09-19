import bluebird        from 'bluebird';
import chai            from 'chai';
import chaiAsPromised  from 'chai-as-promised';
import sinon           from 'sinon';
import sinonChai       from 'sinon-chai';
import sinonAsPromised from 'sinon-as-promised';

// ---

sinonAsPromised(bluebird);
global.should = chai.should();

// ---

chai.use(chaiAsPromised);
chai.use(sinonChai);

// ---

beforeEach(function setupTest() {
  this.sinon = sinon.sandbox.create();
});

afterEach(function closeTest() {
  this.sinon.restore();
});
