
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFiles: ['dotenv/config', '<rootDir>/tests/jest.env.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@/app/(.*)$': '<rootDir>/app/$1',
  },
  testMatch: ['<rootDir>/__tests__/**/*.test.(ts|tsx)'],
  testPathIgnorePatterns: ['<rootDir>/__tests__/db'],
}

module.exports = createJestConfig(customJestConfig)
