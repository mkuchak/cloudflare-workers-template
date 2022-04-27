export default {
  clearMocks: true,
  coverageProvider: 'v8',
  globalSetup: './test/globalSetup.ts',
  globalTeardown: './test/globalTeardown.ts',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^#/(.*)$': '<rootDir>/test/$1',
  },
  testEnvironment: 'miniflare',
  transform: {
    '^.+\\.(t|j)sx?$': 'esbuild-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!(prisma-client-dataproxy)/)'],
  watchPathIgnorePatterns: [
    './node_modules',
    './dist',
    './coverage',
    './dataproxy',
  ],
}
