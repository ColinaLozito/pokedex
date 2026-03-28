import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect } from 'react'
import GlobalErrorBoundary from '@/shared/components/ui/atomic/GlobalErrorBoundary'
import { Provider as TamaguiProvider } from './TamaguiProvider'
import { prefetchPokemonTypes } from '@/shared/hooks/usePokemonTypesPrefetch'

const STALE_TIME = 1000 * 60 * 60 * 24 // 24 hours
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
let persistInitialized = false

export function getQueryClient(): QueryClient {
  if (!queryClientInstance) {
    queryClientInstance = defaultQueryClient
  }
  return queryClientInstance
}

export const queryClient = defaultQueryClient

interface MainProvidersWrapperProps {
  children: React.ReactNode
}

export function MainProvidersWrapper({ children }: MainProvidersWrapperProps) {
  useEffect(() => {
    if (!persistInitialized) {
      persistInitialized = true
      persistQueryClient({
        persister: asyncStoragePersister,
        queryClient: defaultQueryClient,
        maxAge: STALE_TIME,
        buster: 'v1',
      })
    }
  }, [])

  useEffect(() => {
    prefetchPokemonTypes()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider>
        <GlobalErrorBoundary onReset={() => {}}>
          {children}
        </GlobalErrorBoundary>
      </TamaguiProvider>
    </QueryClientProvider>
  )
}

export { QueryClient }
