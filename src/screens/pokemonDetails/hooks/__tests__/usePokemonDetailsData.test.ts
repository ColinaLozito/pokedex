import { renderHook } from '@testing-library/react-native'
import { usePokemonDetailsData } from '../usePokemonDetailsData'

const mockUsePokemonDataStore = jest.fn()
const mockUsePokemonGeneralStore = jest.fn()

jest.mock('@/store/pokemonDataStore', () => ({
  usePokemonDataStore: (...args: unknown[]) => mockUsePokemonDataStore(...args),
}))

jest.mock('@/store/pokemonGeneralStore', () => ({
  usePokemonGeneralStore: (...args: unknown[]) => mockUsePokemonGeneralStore(...args),
}))

describe('usePokemonDetailsData', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return data with currentPokemon, currentPokemonId, bookmarkedPokemonIds, isBookmarked', () => {
    const mockPokemon = { id: 1, name: 'bulbasaur', types: [] }

    mockUsePokemonDataStore.mockReturnValue({
      loading: false,
      error: null,
      currentId: 1,
      pokemon: mockPokemon,
      getPokemonDetail: jest.fn(),
      fetchPokemonDetail: jest.fn(),
      clearError: jest.fn(),
    })

    mockUsePokemonGeneralStore.mockReturnValue({
      bookmarkedIds: [1],
      toggleBookmark: jest.fn(),
    })

    const { result } = renderHook(() => usePokemonDetailsData())

    expect(result.current.data.currentPokemon).toEqual(mockPokemon)
    expect(result.current.data.currentPokemonId).toBe(1)
    expect(result.current.data.bookmarkedPokemonIds).toEqual([1])
    expect(result.current.data.isBookmarked).toBe(true)
  })

  it('should return isBookmarked false when id is not in bookmarkedIds', () => {
    mockUsePokemonDataStore.mockReturnValue({
      loading: false,
      error: null,
      currentId: 2,
      pokemon: { id: 2, name: 'ivysaur', types: [] },
      getPokemonDetail: jest.fn(),
      fetchPokemonDetail: jest.fn(),
      clearError: jest.fn(),
    })

    mockUsePokemonGeneralStore.mockReturnValue({
      bookmarkedIds: [1],
      toggleBookmark: jest.fn(),
    })

    const { result } = renderHook(() => usePokemonDetailsData())

    expect(result.current.data.isBookmarked).toBe(false)
  })

  it('should return status with loading and error', () => {
    mockUsePokemonDataStore.mockReturnValue({
      loading: true,
      error: 'Not found',
      currentId: 1,
      pokemon: null,
      getPokemonDetail: jest.fn(),
      fetchPokemonDetail: jest.fn(),
      clearError: jest.fn(),
    })

    mockUsePokemonGeneralStore.mockReturnValue({
      bookmarkedIds: [],
      toggleBookmark: jest.fn(),
    })

    const { result } = renderHook(() => usePokemonDetailsData())

    expect(result.current.status.loading).toBe(true)
    expect(result.current.status.error).toBe('Not found')
  })

  it('should return actions with getPokemonDetail, fetchPokemonDetail, toggleBookmark, clearError', () => {
    const mockFetchPokemonDetail = jest.fn()
    const mockToggleBookmark = jest.fn()
    const mockClearError = jest.fn()
    const mockGetPokemonDetail = jest.fn()

    mockUsePokemonDataStore.mockReturnValue({
      loading: false,
      error: null,
      currentId: null,
      pokemon: undefined,
      getPokemonDetail: mockGetPokemonDetail,
      fetchPokemonDetail: mockFetchPokemonDetail,
      clearError: mockClearError,
    })

    mockUsePokemonGeneralStore.mockReturnValue({
      bookmarkedIds: [],
      toggleBookmark: mockToggleBookmark,
    })

    const { result } = renderHook(() => usePokemonDetailsData())

    expect(result.current.actions.getPokemonDetail).toBe(mockGetPokemonDetail)
    expect(result.current.actions.fetchPokemonDetail).toBe(mockFetchPokemonDetail)
    expect(result.current.actions.toggleBookmark).toBe(mockToggleBookmark)
    expect(result.current.actions.clearError).toBe(mockClearError)
  })
})
