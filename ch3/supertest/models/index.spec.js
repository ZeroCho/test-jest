beforeEach(() => {
  jest.resetModules();
});

it('models/index.js이 잘 실행된다', () => {
  const db = require('./index');
  jest.spyOn(db.Hashtag, 'initiate').mockImplementation();
  jest.spyOn(db.Post, 'initiate').mockImplementation();
  jest.spyOn(db.User, 'initiate').mockImplementation();
  expect(db).toBeDefined();
})

it('models/index.js이 NODE_ENV가 undefined일 때도 잘 실행된다', () => {
  delete process.env.NODE_ENV;
  const db = require('./index');
  jest.spyOn(db.Hashtag, 'initiate').mockImplementation();
  jest.spyOn(db.Post, 'initiate').mockImplementation();
  jest.spyOn(db.User, 'initiate').mockImplementation();
  expect(db).toBeDefined();
})