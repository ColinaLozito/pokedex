import { renderHook, act } from '@testing-library/react-native'
import { usePokemonDetailsScreen } from '../use-pokemon-details.screen'
import { usePokemonDetailsGQL } from '../use-pokemon-details.hook'
import { useGetCachedPokemonDetail } from '@/shared/hooks/useGetCachedPokemonDetail'
import { usePokemonSelect } from '@/shared/hooks/usePokemonSelect'
import { useUserStore } from '@/store/userStore'

const mockUsePokemonDetailsGQL = usePokemonDetailsGQL as jest.MockedFunction<typeof usePokemonDetailsGQL>
const mockUseGetCachedPokemonDetail = useGetCachedPokemonDetail as jest.MockedFunction<typeof useGetCachedPokemonDetail>
const mockUsePokemonSelect = usePokemonSelect as jest.MockedFunction<typeof usePokemonSelect>
const mockUseUserStore = useUserStore as jest.MockedFunction<typeof useUserStore>

jest.mock('../use-pokemon-details.hook')
jest.mock('@/shared/hooks/useGetCachedPokemonDetail')
jest.mock('@/shared/hooks/usePokemonSelect')
jest.mock('@/store/userStore')
jest.mock('@/utils/pokemon/typeStyles', () => ({
  getPokemonTypeStyles: jest.fn((type: string) => ({
    typeColor: type === 'fire' ? '#F08030' : '#A8A878',
    typeIcon: undefined,
  })),
}))
jest.mock('@theme/colors', () => ({
  baseColors: {
    white: '#FFFFFF',
  },
}))

jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(() => ({ id: '1' })),
}))

describe('usePokemonDetailsScreen', () => {
  const mockGetPokemonDetail = jest.fn()
  const mockHandleSelect = jest.fn()
  const mockToggleBookmark = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    mockUsePokemonDetailsGQL.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    })

    mockUseGetCachedPokemonDetail.mockReturnValue(mockGetPokemonDetail)

    mockUsePokemonSelect.mockReturnValue({
      handleSelect: mockHandleSelect,
    } as never)

    mockUseUserStore.mockReturnValue({
      bookmarkedPokemonIds: [],
      toggleBookmark: mockToggleBookmark,
    })
  })

  describe('Initial state', () => {
    it('should return initial data structure', () => {
      const { result } = renderHook(() => usePokemonDetailsScreen())

      expect(result.current.data).toBeDefined()
      expect(result.current.status).toBeDefined()
      expect(result.current.actions).toBeDefined()
    })

    it('should return loading state from hook', () => {
      mockUsePokemonDetailsGQL.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        refetch: jest.fn(),
      })

      const { result } = renderHook(() => usePokemonDetailsScreen())

      expect(result.current.status.loading).toBe(true)
    })
  })

  describe('Success state', () => {
    it('should return transformed pokemon data', () => {
      mockUsePokemonDetailsGQL.mockReturnValue({
        data: {
          id: 1,
          name: 'bulbasaur',
          height: 7,
          weight: 69,
          sprites: { front_default: 'https://example.com/sprite.png', front_shiny: null },
          types: [{ slot: 1, type: { name: 'grass' } }],
          stats: [],
          abilities: [],
          speciesInfo: { genus: 'Seed Pokemon', flavorText: 'Test', habitat: 'forest', isLegendary: false, isMythical: false },
          evolutionChain: [],
        },
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      })

      const { result } = renderHook(() => usePokemonDetailsScreen())

      expect(result.current.data.currentPokemon).toBeDefined()
      expect(result.current.data.currentPokemon?.id).toBe(1)
      expect(result.current.data.currentPokemon?.name).toBe('bulbasaur')
    })

    it('should calculate primary type color', () => {
      mockUsePokemonDetailsGQL.mockReturnValue({
        data: {
          id: 1,
          name: 'bulbasaur',
          height: 7,
          weight: 69,
          sprites: { front_default: 'https://example.com/sprite.png', front_shiny: null },
          types: [{ slot: 1, type: { name: 'fire' } }],
          stats: [],
          abilities: [],
          speciesInfo: { genus: 'Seed Pokemon', flavorText: 'Test', habitat: 'forest', isLegendary: false, isMythical: false },
          evolutionChain: [],
        },
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      })

      const { result } = renderHook(() => usePokemonDetailsScreen())

      expect(result.current.data.primaryTypeColor).toBe('#F08030')
    })
  })

  describe('Bookmark functionality', () => {
    it('should return isBookmarked true when pokemon is bookmarked', () => {
      mockUseUserStore.mockReturnValue({
        bookmarkedPokemonIds: [1, 2, 3],
        toggleBookmark: mockToggleBookmark,
      })

      const { result } = renderHook(() => usePokemonDetailsScreen())

      expect(result.current.data.isBookmarked).toBe(true)
    })

    it('should return isBookmarked false when pokemon is not bookmarked', () => {
      mockUseUserStore.mockReturnValue({
        bookmarkedPokemonIds: [2, 3],
        toggleBookmark: mockToggleBookmark,
      })

      const { result } = renderHook(() => usePokemonDetailsScreen())

      expect(result.current.data.isBookmarked).toBe(false)
    })

    it('should call toggleBookmark when handleBookmarkPress is triggered', () => {
      mockUsePokemonDetailsGQL.mockReturnValue({
        data: {
          id: 1,
          name: 'bulbasaur',
          height: 7,
          weight: 69,
          sprites: { front_default: 'https://example.com/sprite.png', front_shiny: null },
          types: [],
          stats: [],
          abilities: [],
          speciesInfo: { genus: 'Seed Pokemon', flavorText: 'Test', habitat: null, isLegendary: false, isMythical: false },
          evolutionChain: [],
        },
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      })

      const { result } = renderHook(() => usePokemonDetailsScreen())

      result.current.actions.handleBookmarkPress()

      expect(mockToggleBookmark).toHaveBeenCalledWith(1)
    })
  })

  describe('Error state', () => {
    it('should return error state from hook', () => {
      mockUsePokemonDetailsGQL.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error('Failed to load'),
        refetch: jest.fn(),
      })

      const { result } = renderHook(() => usePokemonDetailsScreen())

      expect(result.current.status.error).toBe('Failed to load')
    })

    it('should return error message when isError is true', () => {
      mockUsePokemonDetailsGQL.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: null,
        refetch: jest.fn(),
      })

      const { result } = renderHook(() => usePokemonDetailsScreen())

      expect(result.current.status.error).toBe('Failed to load Pokemon')
    })
  })

  describe('Actions', () => {
    it('should return handleEvolutionPress action', () => {
      mockUsePokemonDetailsGQL.mockReturnValue({
        data: {
          id: 1,
          name: 'bulbasaur',
          height: 7,
          weight: 69,
          sprites: { front_default: 'https://example.com/sprite.png', front_shiny: null },
          types: [],
          stats: [],
          abilities: [],
          speciesInfo: { genus: 'Seed Pokemon', flavorText: 'Test', habitat: null, isLegendary: false, isMythical: false },
          evolutionChain: [
            { id: 2, name: 'ivysaur' },
          ],
        },
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      })

      const { result } = renderHook(() => usePokemonDetailsScreen())

      expect(result.current.actions.handleEvolutionPress).toBeDefined()
    })

    it('should return getPokemonDetail action', () => {
      const { result } = renderHook(() => usePokemonDetailsScreen())

      expect(result.current.actions.getPokemonDetail).toBeDefined()
    })

    it('should return clearError action', () => {
      const { result } = renderHook(() => usePokemonDetailsScreen())

      expect(result.current.actions.clearError).toBeDefined()
    })
  })

  describe('Edge cases', () => {
    it('should handle missing id gracefully', () => {
      const { result } = renderHook(() => usePokemonDetailsScreen())

      expect(result.current.data.currentPokemon).toBeUndefined()
      expect(result.current.data.isBookmarked).toBe(false)
    })

    it('should handle empty types gracefully', () => {
      mockUsePokemonDetailsGQL.mockReturnValue({
        data: {
          id: 1,
          name: 'bulbasaur',
          height: 7,
          weight: 69,
          sprites: { front_default: 'https://example.com/sprite.png', front_shiny: null },
          types: [],
          stats: [],
          abilities: [],
          speciesInfo: { genus: 'Seed Pokemon', flavorText: 'Test', habitat: null, isLegendary: false, isMythical: false },
          evolutionChain: [],
        },
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      })

      const { result } = renderHook(() => usePokemonDetailsScreen())

      expect(result.current.data.primaryTypeColor).toBe('#FFFFFF')
    })
  })
})
