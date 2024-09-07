/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+.tsx?$": ["ts-jest",{
      tsconfig: 'tsconfig.app.json',
    }],
  },
  setupFiles: [
    './jestSetup.ts'
  ]
};