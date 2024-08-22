export function error() {
  throw new Error();
}

export class CustomError extends Error {}
export function customeError() {
  throw new CustomError();
}