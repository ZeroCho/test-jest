it('first import', async () => {
  const c = await import('./mockClass'); // require('./mockClass')
  (c as any).prop = 'hello';
  expect(c).toBeDefined();
})

it('second import', async () => {
  const c = await import('./mockClass');
  expect((c as any).prop).toBe('hello');
})