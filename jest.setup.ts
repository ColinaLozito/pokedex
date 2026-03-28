import '@testing-library/react-native'

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: jest.fn(() => ({})),
  useGlobalSearchParams: jest.fn(() => ({})),
  Link: ({ children }: { children: React.ReactNode }) => children,
  Tabs: ({ children }: { children: React.ReactNode }) => children,
  Stack: ({ children }: { children: React.ReactNode }) => children,
  useSegments: () => [],
  Href: jest.fn(),
}))

jest.mock('expo-constants', () => ({
  default: {
    manifest: {},
    systemFonts: [],
  },
}))

jest.mock('graphql-request', () => ({
  default: jest.fn(),
  gql: (strings: TemplateStringsArray, ...args: string[]) => {
    return strings.reduce((result, string, i) => {
      return result + string + (args[i] || '')
    }, '')
  },
}))

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
  keepPreviousData: { },
  QueryClient: jest.fn().mockImplementation(() => ({
    getQueryData: jest.fn(),
    setQueryData: jest.fn(),
    prefetchQuery: jest.fn(),
  })),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => children,
}))

global.fetch = jest.fn()
