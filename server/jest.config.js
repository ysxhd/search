module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/*.ts', '<rootDir>/src/**/*.ts'],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
  rootDir: './',
  roots: ['<rootDir>/src'],
  testPathIgnorePatterns: ['<rootDir>/src/testUtils/'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
