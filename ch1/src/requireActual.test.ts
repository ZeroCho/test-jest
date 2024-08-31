jest.mock('./mockFunc', () => {
  return {
    ...jest.requireActual('./mockFunc'),
    double: jest.fn(),
  }
});
jest.mock('./mockClass');
import func from './mockFunc';
import c from './mockClass';

it('func와 c가 정의되어 있어야 한다.', () => {
  const original = jest.requireActual('./mockFunc');
  console.log(original);
  console.log(func);
  expect(func).toBeDefined();
  expect(c).toBeDefined();
});