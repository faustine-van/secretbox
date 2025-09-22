
module.exports = {
  ...require('./jest.config.js'),
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/tests/jest.db.setup.ts'],
  testMatch: ['<rootDir>/__tests__/db/**/*.test.ts'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/$1'
  },
};
