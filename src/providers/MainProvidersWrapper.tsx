import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import GlobalErrorBoundary from '../components/common/GlobalErrorBoundary'
import { fetchTypeList } from '../services/api'
import { usePokemonGeneralStore } from '../store/pokemonGeneralStore'
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
  const typeList = usePokemonGeneralStore((state) => state.typeList)
  const setTypeList = usePokemonGeneralStore((state) => state.setTypeList)
  const fetchPokemonListAction = usePokemonGeneralStore((state) => state.fetchPokemonListAction)

  useEffect(() => {
    fetchPokemonListAction()

    if (typeList.length === 0) {
      fetchTypeList()
        .then((list) => {
          setTypeList(list)
        })
        .catch((_error) => {
          // Error is handled silently
        })
    }
  }, [fetchPokemonListAction, typeList.length, setTypeList])

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
