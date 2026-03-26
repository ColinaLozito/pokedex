import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import GlobalErrorBoundary from '../components/common/GlobalErrorBoundary'
import { Provider as TamaguiProvider } from './TamaguiProvider'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
})

interface MainProvidersWrapperProps {
  children: React.ReactNode
}

export function MainProvidersWrapper({ children }: MainProvidersWrapperProps) {
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
