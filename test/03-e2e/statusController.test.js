// import bluebird  from 'bluebird';
// import supertest from 'supertest';
// import containerFactory from '../support/testContainerFactory';
//
// // ---
//
// const container = containerFactory.createContainer();
//
// // ---
//
// describe.skip('statusController', container.describe(() => {
//   let request;
//
//   beforeEach(function beforeEach() {
//     this.container.resolve((app) => {
//       request = supertest(app);
//     });
//   });
//
//   describe('GET /api/v1/status/echo', () => {
//     it('should respond with correct status and body', () => (
//       bluebird.fromNode((callback) => {
//         request.get('/api/v1/status/echo')
//           .send()
//           .expect(200, { status: 'up' })
//           .end(callback)
//         ;
//       })
//     ));
//   });
// }));
