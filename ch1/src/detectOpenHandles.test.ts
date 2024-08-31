beforeEach(() => {
  jest.useFakeTimers();
});

it('openHandles', () => {
  setInterval(() => {
    console.log('hi');
  })
  expect(1).toBe(1);
})

afterAll(() => {
  jest.clearAllTimers();
})