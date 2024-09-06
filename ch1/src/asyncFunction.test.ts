import * as fns from './asyncFunction';

test('okPromise 테스트', () => {
  expect.assertions(1);
  jest.spyOn(fns, 'okPromise').mockResolvedValue('ok');
  return expect(fns.okPromise()).resolves.toBe('ok');
});

test('okPromise 테스트2', () => {
  expect.assertions(1);
  const okSpy = jest.fn(fns.okPromise);
  return okSpy().then((result) => {
    expect(result).toBe('ok');
  })
})

test('okPromise 테스트3', async () => {
  expect.assertions(1);
  const okSpy = jest.fn(fns.okPromise);
  const result = await okSpy();
  expect(result).toBe('ok');
});

test('noPromise 테스트', () => {
  expect.assertions(1);
  const noSpy = jest.fn(fns.noPromise);
  return noSpy().catch((result) => {
    expect(result).toBe('no');
  })
})

test('noPromise 테스트2', () => {
  expect.assertions(1);
  jest.spyOn(fns, 'noPromise').mockRejectedValue('no');
  return expect(fns.noPromise()).rejects.toBe('no');
})

test('noPromise 테스트2', async () => {
  expect.assertions(1);
  const noSpy = jest.fn(fns.noPromise);
  try {
    const result = await noSpy();
  } catch (err) {
    expect(err).toBe('no');
  }
})

test('okAsync 테스트', () => {
  const okSpy = jest.fn(fns.okAsync);
  return expect(okSpy()).resolves.toBe('ok');
});

test('okAsync 테스트2', () => {
  const okSpy = jest.fn(fns.okAsync);
  return okSpy().then((result) => {
    expect(result).toBe('ok');
  })
})

test('okAsync 테스트3', async () => {
  const okSpy = jest.fn(fns.okAsync);
  const result = await okSpy();
  expect(result).toBe('ok');
});

