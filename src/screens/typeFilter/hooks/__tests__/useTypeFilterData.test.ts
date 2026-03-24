import { renderHook } from '@testing-library/react-native'
import { useTypeFilterData } from '../useTypeFilterData'

const mockUsePokemonGeneralStore = jest.fn()
const mockUsePokemonDataStore = jest.fn()
const mockUsePokemonSelection = jest.fn()

jest.mock('@/store/pokemonGeneralStore', () => ({
  usePokemonGeneralStore: (...args: unknown[]) => mockUsePokemonGeneralStore(...args),
}))

jest.mock('@/store/pokemonDataStore', () => ({
  usePokemonDataStore: (...args: unknown[]) => mockUsePokemonDataStore(...args),
}))

jest.mock('@/hooks/usePokemonSelection', () => ({
  usePokemonSelection: (...args: unknown[]) => mockUsePokemonSelection(...args),
}))

jest.mock('@theme/pokemonTypes', () => ({
  PokemonType: 'fire',
}))

describe('useTypeFilterData', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return status with loading initially', () => {
    mockUsePokemonGeneralStore.mockImplementation((selector?: (state: never) => unknown) => {
      if (typeof selector === 'function') {
        return selector({
          fetchPokemonByTypeAndGetDisplayData: jest.fn(),
          getPokemonDisplayData: jest.fn(),
          addRecentSelection: jest.fn(),
          isTypeCached: jest.fn().mockReturnValue(false),
          pokemonByType: {},
        } as never)
      }
      return {
        fetchPokemonByTypeAndGetDisplayData: jest.fn(),
        getPokemonDisplayData: jest.fn(),
        addRecentSelection: jest.fn(),
        isTypeCached: jest.fn().mockReturnValue(false),
        pokemonByType: {},
      }
    })

    mockUsePokemonDataStore.mockImplementation((selector?: (state: never) => unknown) => {
      if (typeof selector === 'function') {
        return selector({
          fetchPokemonDetail: jest.fn(),
          getPokemonDetail: jest.fn(),
          pokemonDetails: {},
        } as never)
      }
      return {
        fetchPokemonDetail: jest.fn(),
        getPokemonDetail: jest.fn(),
        pokemonDetails: {},
      }
    })

    mockUsePokemonSelection.mockReturnValue({
      isLoading: false,
      handleSelect: jest.fn(),
    })

    const { result } = renderHook(() => useTypeFilterData(1, 'fire'))

    expect(result.current.status.loading).toBe(true)
  })

  it('should return actions with loadPokemon and loadMore', () => {
    mockUsePokemonGeneralStore.mockImplementation((selector?: (state: never) => unknown) => {
      if (typeof selector === 'function') {
        return selector({
          fetchPokemonByTypeAndGetDisplayData: jest.fn(),
          getPokemonDisplayData: jest.fn(),
          addRecentSelection: jest.fn(),
          isTypeCached: jest.fn().mockReturnValue(false),
          pokemonByType: {},
        } as never)
      }
      return {
        fetchPokemonByTypeAndGetDisplayData: jest.fn(),
        getPokemonDisplayData: jest.fn(),
        addRecentSelection: jest.fn(),
        isTypeCached: jest.fn().mockReturnValue(false),
        pokemonByType: {},
      }
    })

    mockUsePokemonDataStore.mockImplementation((selector?: (state: never) => unknown) => {
      if (typeof selector === 'function') {
        return selector({
          fetchPokemonDetail: jest.fn(),
          getPokemonDetail: jest.fn(),
          pokemonDetails: {},
        } as never)
      }
      return {
        fetchPokemonDetail: jest.fn(),
        getPokemonDetail: jest.fn(),
        pokemonDetails: {},
      }
    })

    mockUsePokemonSelection.mockReturnValue({
      isLoading: false,
      handleSelect: jest.fn(),
    })

    const { result } = renderHook(() => useTypeFilterData(1, 'fire'))

    expect(typeof result.current.actions.loadPokemon).toBe('function')
    expect(typeof result.current.actions.loadMore).toBe('function')
    expect(typeof result.current.actions.handleSelect).toBe('function')
  })

  it('should return data with filteredData, pokemonListForRecent, hasMore', () => {
    mockUsePokemonGeneralStore.mockImplementation((selector?: (state: never) => unknown) => {
      if (typeof selector === 'function') {
        return selector({
          fetchPokemonByTypeAndGetDisplayData: jest.fn(),
          getPokemonDisplayData: jest.fn(),
          addRecentSelection: jest.fn(),
          isTypeCached: jest.fn().mockReturnValue(true),
          pokemonByType: { fire: [] },
        } as never)
      }
      return {
        fetchPokemonByTypeAndGetDisplayData: jest.fn(),
        getPokemonDisplayData: jest.fn(),
        addRecentSelection: jest.fn(),
        isTypeCached: jest.fn().mockReturnValue(true),
        pokemonByType: { fire: [] },
      }
    })

    mockUsePokemonDataStore.mockImplementation((selector?: (state: never) => unknown) => {
      if (typeof selector === 'function') {
        return selector({
          fetchPokemonDetail: jest.fn(),
          getPokemonDetail: jest.fn(),
          pokemonDetails: {},
        } as never)
      }
      return {
        fetchPokemonDetail: jest.fn(),
        getPokemonDetail: jest.fn(),
        pokemonDetails: {},
      }
    })

    mockUsePokemonSelection.mockReturnValue({
      isLoading: false,
      handleSelect: jest.fn(),
    })

    const { result } = renderHook(() => useTypeFilterData(1, 'fire'))

    expect(result.current.data).toBeDefined()
    expect(result.current.data.hasMore).toBe(false)
  })
})
