import { obj } from './toStrictEqual';

test('객체는 toStrictEqual로 비교한다', () => {
  expect(obj()).toStrictEqual({ a: 'hello' });
  expect(obj()).not.toBe({ a: 'hello' });
});

test('배열끼리도 toStrictEqual 써야한다', () => {
  expect([1,2,3]).toStrictEqual([1, 2, 3]);
  expect([1,2,3]).not.toBe([1, 2, 3]);
});