module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@theme/(.*)$': '<rootDir>/theme/colors.ts',
    '^theme/(.*)$': '<rootDir>/theme/colors.ts',
    '^@theme/colors$': '<rootDir>/theme/colors.ts',
    '^theme/colors$': '<rootDir>/theme/colors.ts',
    '^@theme/pokemonTypes$': '<rootDir>/theme/pokemonTypes.ts',
    '^theme/pokemonTypes$': '<rootDir>/theme/pokemonTypes.ts',
    '^tamagui$': '<rootDir>/__mocks__/tamagui.ts',
    '^@tamagui/toast$': '<rootDir>/__mocks__/tamagui-toast.ts',
    '^@tamagui/lucide-icons$': '<rootDir>/__mocks__/tamagui-lucide-icons.ts',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|@unimodules|unimodules|expo-modules-core|@tamagui)/)',
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
      statements: 40,
      branches: 30,
      functions: 40,
      lines: 40,
    },
  },
}