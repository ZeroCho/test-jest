import { obj } from './toMatchObject';

test('클래스 비교는 toMatchObject로 해야 한다', () => {
  expect(obj('hello')).not.toStrictEqual({ a: 'hello' });
  expect(obj('hello')).toMatchObject({ a: 'hello' });
});