it.skip('1 더하기 1은 2', () => {
  expect(1 + 1).toBe(2);
})
it.skip('2 더하기 3은 5', () => {
  expect(2 + 3).toBe(5);
})
it.skip('3 더하기 4은 7', () => {
  expect(3 + 4).toBe(7);
})

it.each([
  { a: 1, b: 1, c: 2 },
  { a: 2, b: 3, c: 5 },
  { a: 3, b: 4, c: 7 },
])('$a 더하기 $b는 $c', ({ a, b, c }) => {
  expect(a + b).toBe(c);
})
