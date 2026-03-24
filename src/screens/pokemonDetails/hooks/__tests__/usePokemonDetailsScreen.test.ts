import { renderHook } from '@testing-library/react-native'
import { usePokemonDetailsScreen } from '../usePokemonDetailsScreen'

const mockUsePokemonDetailsData = jest.fn()

jest.mock('../usePokemonDetailsData', () => ({
  usePokemonDetailsData: (...args: unknown[]) => mockUsePokemonDetailsData(...args),
}))

jest.mock('theme/colors', () => ({
  baseColors: {
    white: '#ffffff',
  },
}))

jest.mock('src/utils/pokemon/typeStyles', () => ({
  getPokemonTypeStyles: jest.fn().mockReturnValue({ typeColor: '#ff0000' }),
}))

describe('usePokemonDetailsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return data with currentPokemon, isBookmarked', () => {
    const mockPokemon = {
      id: 1,
      name: 'bulbasaur',
      types: [{ slot: 1, type: { name: 'grass', url: '' } }],
    }

    mockUsePokemonDetailsData.mockReturnValue({
      data: {
        currentPokemon: mockPokemon,
        isBookmarked: true,
      },
      status: { loading: false, error: null },
      actions: {
        getPokemonDetail: jest.fn(),
        fetchPokemonDetail: jest.fn(),
        toggleBookmark: jest.fn(),
        clearError: jest.fn(),
      },
    })

    const { result } = renderHook(() => usePokemonDetailsScreen())

    expect(result.current.data.currentPokemon).toEqual(mockPokemon)
    expect(result.current.data.isBookmarked).toBe(true)
  })

  it('should return status with loading and error', () => {
    mockUsePokemonDetailsData.mockReturnValue({
      data: { currentPokemon: null, isBookmarked: false },
      status: { loading: true, error: 'Error loading' },
      actions: {
        getPokemonDetail: jest.fn(),
        fetchPokemonDetail: jest.fn(),
        toggleBookmark: jest.fn(),
        clearError: jest.fn(),
      },
    })

    const { result } = renderHook(() => usePokemonDetailsScreen())

    expect(result.current.status.loading).toBe(true)
    expect(result.current.status.error).toBe('Error loading')
  })

  it('should return actions from usePokemonDetailsData', () => {
    const mockFetchPokemonDetail = jest.fn()
    const mockToggleBookmark = jest.fn()
    const mockClearError = jest.fn()
    const mockGetPokemonDetail = jest.fn()

    mockUsePokemonDetailsData.mockReturnValue({
      data: { currentPokemon: null, isBookmarked: false },
      status: { loading: false, error: null },
      actions: {
        getPokemonDetail: mockGetPokemonDetail,
        fetchPokemonDetail: mockFetchPokemonDetail,
        toggleBookmark: mockToggleBookmark,
        clearError: mockClearError,
      },
    })

    const { result } = renderHook(() => usePokemonDetailsScreen())

    expect(result.current.actions.getPokemonDetail).toBe(mockGetPokemonDetail)
    expect(result.current.actions.clearError).toBe(mockClearError)
  })

  it('should return handleBookmarkPress function', () => {
    mockUsePokemonDetailsData.mockReturnValue({
      data: { currentPokemon: { id: 1, name: 'bulbasaur', types: [] }, isBookmarked: false },
      status: { loading: false, error: null },
      actions: {
        getPokemonDetail: jest.fn(),
        fetchPokemonDetail: jest.fn(),
        toggleBookmark: jest.fn(),
        clearError: jest.fn(),
      },
    })

    const { result } = renderHook(() => usePokemonDetailsScreen())

    expect(typeof result.current.actions.handleBookmarkPress).toBe('function')
  })

  it('should return handleEvolutionPress function', () => {
    mockUsePokemonDetailsData.mockReturnValue({
      data: { currentPokemon: { id: 1, name: 'bulbasaur', types: [] }, isBookmarked: false },
      status: { loading: false, error: null },
      actions: {
        getPokemonDetail: jest.fn(),
        fetchPokemonDetail: jest.fn(),
        toggleBookmark: jest.fn(),
        clearError: jest.fn(),
      },
    })

    const { result } = renderHook(() => usePokemonDetailsScreen())

    expect(typeof result.current.actions.handleEvolutionPress).toBe('function')
  })
})
