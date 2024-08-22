export function timer(callback: (str: string) => void) {
  setTimeout(() => {
    callback('success');
  }, 10_000);
}