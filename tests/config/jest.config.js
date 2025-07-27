module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/api/**/*.test.js'],
  verbose: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['../support/api-setup.js'],
  testTimeout: 30000,
  roots: ['../api'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
};
