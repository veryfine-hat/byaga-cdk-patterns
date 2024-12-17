import { createDefaultPreset, JestConfigWithTsJest } from 'ts-jest'

const base: JestConfigWithTsJest = createDefaultPreset({
  tsconfig: './tsconfig.spec.json',
})
export default {
  ...base,
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/lib/', '/archive/', '/test-results/', '/.idea/'],
  automock: true,
  clearMocks: true,
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: './test-results/junit',
        outputName: 'junit.xml'
      }
    ],
    [
      "jest-html-reporters",
      {
        publicPath: './test-results/html',
        filename: 'index.html',
        expand: true
      }
    ]
  ],
  collectCoverage: true,
  coverageDirectory: './test-results/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapper: {
    '^aws-cdk-lib$': '<rootDir>/__shim__/index.ts',
    '^aws-cdk-lib/(.*)$': '<rootDir>/__shim__/$1.ts',
  }
};