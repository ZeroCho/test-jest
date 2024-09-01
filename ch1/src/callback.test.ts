import { timer } from "./callback";

test('타이머 잘 실행되나?', (done) => {
  jest.useFakeTimers();
  timer((message: string) => {
    expect(message).toBe('success');
    done();
  })
}, 25_000)

test('시간아 빨리가라!', (done) => {
  jest.useFakeTimers();
  timer((message: string) => {
    expect(message).toBe('success');
    done();
  })
  jest.runAllTimers();
  // jest.advanceTimersByTime(10_000) // 10초 흐르게
})
