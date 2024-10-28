// eslint-disable-next-line @typescript-eslint/no-require-imports
const { pathsToModuleNameMapper } = require('ts-jest');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { compilerOptions } = require('./tsconfig');

module.exports = {
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: '<rootDir>/',
  }),
  collectCoverageFrom: ['src/**/*.{ts,js}', '!src/main.ts'],
};
