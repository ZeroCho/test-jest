import { sum } from './toBe';

test('sum 함수는 두 숫자를 더해야 한다', () => {
  expect(sum(1, 2)).toBe(3);
  expect(sum(1, 2)).not.toBe(2);
});