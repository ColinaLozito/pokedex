import AsyncStorage from '@react-native-async-storage/async-storage'
import { QueryClient } from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/react-query-persist-client'

const STALE_TIME = 1000 * 60 * 60 * 24
const PERSIST_KEY = 'pokedex-cache'

const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      gcTime: STALE_TIME * 7,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

export const asyncStoragePersister = {
  persistClient: async (client: unknown) => {
    await AsyncStorage.setItem(PERSIST_KEY, JSON.stringify(client))
  },
  restoreClient: async () => {
    const cached = await AsyncStorage.getItem(PERSIST_KEY)
    return cached ? JSON.parse(cached) : undefined
  },
  removeClient: async () => {
    await AsyncStorage.removeItem(PERSIST_KEY)
  },
}

let queryClientInstance: QueryClient | null = null

export const queryClient = defaultQueryClient

export function getQueryClient(): QueryClient {
  if (!queryClientInstance) {
    queryClientInstance = defaultQueryClient
  }
  return queryClientInstance
}

export function initializeQueryClient() {
  persistQueryClient({
    persister: asyncStoragePersister,
    queryClient: defaultQueryClient,
    maxAge: STALE_TIME,
    buster: 'v1',
  })
}

export { defaultQueryClient }
