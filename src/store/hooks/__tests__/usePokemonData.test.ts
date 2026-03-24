import { renderHook } from '@testing-library/react-native'
import { usePokemonList, usePokemonDetail, useCurrentPokemon } from '../usePokemonData'

const mockUsePokemonGeneralStore = jest.fn()
const mockUsePokemonDataStore = jest.fn()

const createMockStore = (selectors: Record<string, unknown>) => {
  return (selector?: (state: never) => unknown) => {
    if (typeof selector === 'function') {
      const keys = Object.keys(selectors)
      const mockState = selectors as never
      return selector(mockState)
    }
    return selectors
  }
}

jest.mock('../../pokemonGeneralStore', () => ({
  usePokemonGeneralStore: (...args: unknown[]) => mockUsePokemonGeneralStore(...args),
}))

jest.mock('../../pokemonDataStore', () => ({
  usePokemonDataStore: (...args: unknown[]) => mockUsePokemonDataStore(...args),
}))

describe('usePokemonList', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return list and fetchList from store', () => {
    const mockList = [{ id: 1, name: 'bulbasaur' }]
    const mockFetchList = jest.fn()

    mockUsePokemonGeneralStore.mockImplementation((selector?: (state: never) => unknown) => {
      if (typeof selector === 'function') {
        return selector({
          pokemonList: mockList,
          fetchPokemonListAction: mockFetchList,
        } as never)
      }
      return {
        pokemonList: mockList,
        fetchPokemonListAction: mockFetchList,
      }
    })

    const { result } = renderHook(() => usePokemonList())

    expect(result.current.list).toEqual(mockList)
    expect(result.current.fetchList).toBe(mockFetchList)
  })
})

describe('usePokemonDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return detail, fetchDetail, loading, error for given id', () => {
    const mockDetail = { id: 1, name: 'bulbasaur' }
    const mockFetchDetail = jest.fn()
    const mockLoading = false
    const mockError = null

    const storeState = {
      pokemonDetails: { 1: mockDetail },
      fetchPokemonDetail: mockFetchDetail,
      loading: mockLoading,
      error: mockError,
    }

    mockUsePokemonDataStore.mockImplementation((selector?: (state: never) => unknown) => {
      if (typeof selector === 'function') {
        return selector(storeState as never)
      }
      return storeState
    })

    const { result } = renderHook(() => usePokemonDetail(1))

    expect(result.current.detail).toEqual(mockDetail)
    expect(result.current.fetchDetail).toBe(mockFetchDetail)
    expect(result.current.loading).toBe(mockLoading)
    expect(result.current.error).toBe(mockError)
  })

  it('should return undefined when id is null', () => {
    const storeState = {
      pokemonDetails: {},
      fetchPokemonDetail: jest.fn(),
      loading: false,
      error: null,
    }

    mockUsePokemonDataStore.mockImplementation((selector?: (state: never) => unknown) => {
      if (typeof selector === 'function') {
        return selector(storeState as never)
      }
      return storeState
    })

    const { result } = renderHook(() => usePokemonDetail(null))

    expect(result.current.detail).toBeUndefined()
  })
})

describe('useCurrentPokemon', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return currentId, currentPokemon, setCurrentId', () => {
    const mockPokemon = { id: 1, name: 'bulbasaur' }
    const mockSetCurrentId = jest.fn()

    const storeState = {
      currentPokemonId: 1,
      pokemonDetails: { 1: mockPokemon },
      setCurrentPokemonId: mockSetCurrentId,
    }

    mockUsePokemonDataStore.mockImplementation((selector?: (state: never) => unknown) => {
      if (typeof selector === 'function') {
        return selector(storeState as never)
      }
      return storeState
    })

    const { result } = renderHook(() => useCurrentPokemon())

    expect(result.current.currentId).toBe(1)
    expect(result.current.currentPokemon).toEqual(mockPokemon)
    expect(result.current.setCurrentId).toBe(mockSetCurrentId)
  })

  it('should return undefined when currentPokemonId is null', () => {
    const storeState = {
      currentPokemonId: null,
      pokemonDetails: {},
      setCurrentPokemonId: jest.fn(),
    }

    mockUsePokemonDataStore.mockImplementation((selector?: (state: never) => unknown) => {
      if (typeof selector === 'function') {
        return selector(storeState as never)
      }
      return storeState
    })

    const { result } = renderHook(() => useCurrentPokemon())

    expect(result.current.currentId).toBeNull()
    expect(result.current.currentPokemon).toBeUndefined()
  })
})
