module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@theme/(.*)$': '<rootDir>/theme/$1',
    '^theme/(.*)$': '<rootDir>/theme/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|@unimodules|unimodules|expo-modules-core)/)',
  ],
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/types/**',
    '!src/**/constants/**',
  ],
  coverageThreshold: {
    global: {
      statements: 45,
      branches: 30,
      functions: 45,
      lines: 45,
    },
  },
}
