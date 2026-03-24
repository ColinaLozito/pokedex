import { useEffect } from 'react'
import GlobalErrorBoundary from '../components/common/GlobalErrorBoundary'
import { fetchTypeList } from '../services/api'
import { usePokemonGeneralStore } from '../store/pokemonGeneralStore'
import { Provider as TamaguiProvider } from './TamaguiProvider'

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
    <TamaguiProvider>
      <GlobalErrorBoundary onReset={() => {}}>
        {children}
      </GlobalErrorBoundary>
    </TamaguiProvider>
  )
}
