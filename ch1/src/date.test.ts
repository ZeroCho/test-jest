import { after3days  } from "./date";

test('3일 후를 리턴한다', () => {
  jest.useFakeTimers().setSystemTime(new Date(2024, 3, 9));
  console.log(new Date());
  expect(after3days()).toStrictEqual(new Date(2024, 3, 12));
});

test('0.1+0.2는 0.3', () => {
  expect(0.1 + 0.2).toBeCloseTo(0.3);
});

afterEach(() => {
  jest.useRealTimers();
});
