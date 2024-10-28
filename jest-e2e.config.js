module.exports = {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  ...require('./jest.config'),
  rootDir: '.',
  roots: ['<rootDir>/__tests__/e2e'],
  testRegex: '.e2e-spec.ts$',
  globalSetup: '<rootDir>/__tests__/e2e/setup.ts',
  globalTeardown: '<rootDir>/__tests__/e2e/teardown.ts',
  testEnvironment: 'node',
};
