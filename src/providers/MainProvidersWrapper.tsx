import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import GlobalErrorBoundary from '../components/common/GlobalErrorBoundary'
import { Provider as TamaguiProvider } from './TamaguiProvider'
import { prefetchPokemonTypes } from '../hooks/usePokemonTypesPrefetch'

const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
})

let queryClientInstance: QueryClient | null = null

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
