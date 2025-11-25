import { usePokemonDataStore } from '../pokemonDataStore'

/**
 * Hook to get Pokemon list
 */
export const usePokemonList = () => {
  const list = usePokemonDataStore(state => state.pokemonList)
  const fetchList = usePokemonDataStore(state => state.fetchPokemonListAction)
  return { list, fetchList }
}

/**
 * Hook to get Pokemon detail with auto-fetch
 */
export const usePokemonDetail = (id: number | null) => {
  const detail = usePokemonDataStore(state => 
    id !== null ? state.pokemonDetails[id] : undefined
  )
  const fetchDetail = usePokemonDataStore(state => state.fetchPokemonDetail)
  const loading = usePokemonDataStore(state => state.loading)
  const error = usePokemonDataStore(state => state.error)
  
  return { detail, fetchDetail, loading, error }
}

/**
 * Hook to get current Pokemon
 */
export const useCurrentPokemon = () => {
  const currentId = usePokemonDataStore(state => state.currentPokemonId)
  const currentPokemon = usePokemonDataStore(state => state.getCurrentPokemon())
  const setCurrentId = usePokemonDataStore(state => state.setCurrentPokemonId)
  
  return { currentId, currentPokemon, setCurrentId }
}

