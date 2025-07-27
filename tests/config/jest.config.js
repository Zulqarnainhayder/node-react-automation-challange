module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/api/**/*.test.js'],
  verbose: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/support/api-setup.js'],
  testTimeout: 30000,
  roots: ['<rootDir>/api'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
};
