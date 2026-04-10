import { renderHook } from '@testing-library/react-native'
import { useTypeFilterScreen } from '../use-type-filter.screen'
import { usePokemonByTypeGQL } from '../use-pokemon-by-type.hook'
import { usePokemonSelect } from '@/shared/hooks/usePokemonSelect'
import { useUserStore } from '@/store/userStore'

const mockUsePokemonByTypeGQL = usePokemonByTypeGQL as jest.MockedFunction<
  typeof usePokemonByTypeGQL
>
const mockUsePokemonSelect = usePokemonSelect as jest.MockedFunction<typeof usePokemonSelect>
const mockUseUserStore = useUserStore as jest.MockedFunction<typeof useUserStore>

jest.mock('../use-pokemon-by-type.hook')
jest.mock('@/shared/hooks/usePokemonSelect')
jest.mock('@/store/userStore')
jest.mock('@/utils/pokemon/typeStyles', () => ({
  getPokemonTypeStyles: jest.fn((type: string) => ({
    typeColor: type === 'fire' ? '#F08030' : '#A8A878',
    typeIcon: undefined,
  })),
}))
jest.mock('@theme/pokemonTypes', () => ({
  POKEMON_TYPES: {
    FIRE: 'fire',
    WATER: 'water',
    GRASS: 'grass',
    NORMAL: 'normal',
  },
}))

describe('useTypeFilterScreen', () => {
  const mockHandleSelect = jest.fn()
  const mockAddRecentSelection = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    mockUsePokemonByTypeGQL.mockReturnValue({
      data: [],
      totalCount: 0,
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      hasMore: false,
      loadMore: jest.fn(),
      refetch: jest.fn(),
    })

    mockUsePokemonSelect.mockReturnValue({
      handleSelect: mockHandleSelect,
    } as never)

    mockUseUserStore.mockReturnValue({
      addRecentSelection: mockAddRecentSelection,
    })
  })

  describe('Initial state', () => {
    it('should return initial data structure', () => {
      const { result } = renderHook(() => useTypeFilterScreen())

      expect(result.current.data).toBeDefined()
      expect(result.current.status).toBeDefined()
      expect(result.current.actions).toBeDefined()
    })

    it('should return loading state from hook', () => {
      mockUsePokemonByTypeGQL.mockReturnValue({
        data: [],
        totalCount: 0,
        isLoading: true,
        isFetching: false,
        isError: false,
        error: null,
        hasMore: false,
        loadMore: jest.fn(),
        refetch: jest.fn(),
      })

      const { result } = renderHook(() => useTypeFilterScreen())

      expect(result.current.status.loading).toBe(true)
      expect(result.current.status.isLoading).toBe(true)
    })
  })

  describe('Data transformation', () => {
    it('should return transformed pokemon data', () => {
      mockUsePokemonByTypeGQL.mockReturnValue({
        data: [
          { id: 1, name: 'bulbasaur', sprite: 'https://example.com/sprite/1.png', primaryType: 'grass', types: [] },
          { id: 2, name: 'ivysaur', sprite: 'https://example.com/sprite/2.png', primaryType: 'grass', types: [] },
        ],
        totalCount: 2,
        isLoading: false,
        isFetching: false,
        isError: false,
        error: null,
        hasMore: false,
        loadMore: jest.fn(),
        refetch: jest.fn(),
      })

      const { result } = renderHook(() => useTypeFilterScreen())

      expect(result.current.data.filteredData).toHaveLength(2)
      expect(result.current.data.pokemonListForRecent).toHaveLength(2)
      expect(result.current.data.pokemonListForRecent[0]).toEqual({ id: 1, name: 'bulbasaur' })
    })

    it('should include typeName in data', () => {
      const { result } = renderHook(() => useTypeFilterScreen())

      expect(result.current.data.typeName).toBe('normal')
    })

    it('should include typeColor in data', () => {
      const { result } = renderHook(() => useTypeFilterScreen())

      expect(result.current.data.typeColor).toBeDefined()
    })

    it('should include hasMore in data', () => {
      mockUsePokemonByTypeGQL.mockReturnValue({
        data: [],
        totalCount: 0,
        isLoading: false,
        isFetching: false,
        isError: false,
        error: null,
        hasMore: true,
        loadMore: jest.fn(),
        refetch: jest.fn(),
      })

      const { result } = renderHook(() => useTypeFilterScreen())

      expect(result.current.data.hasMore).toBe(true)
    })
  })

  describe('Error state', () => {
    it('should return error state from hook', () => {
      mockUsePokemonByTypeGQL.mockReturnValue({
        data: [],
        totalCount: 0,
        isLoading: false,
        isFetching: false,
        isError: true,
        error: new Error('Failed to load'),
        hasMore: false,
        loadMore: jest.fn(),
        refetch: jest.fn(),
      })

      const { result } = renderHook(() => useTypeFilterScreen())

      expect(result.current.status.error).toBe('Failed to load')
    })

    it('should return default error message when error is null but isError is true', () => {
      mockUsePokemonByTypeGQL.mockReturnValue({
        data: [],
        totalCount: 0,
        isLoading: false,
        isFetching: false,
        isError: true,
        error: null,
        hasMore: false,
        loadMore: jest.fn(),
        refetch: jest.fn(),
      })

      const { result } = renderHook(() => useTypeFilterScreen())

      expect(result.current.status.error).toBe('Failed to load Pokemon')
    })
  })

  describe('Actions', () => {
    it('should return handleSelect action', () => {
      const { result } = renderHook(() => useTypeFilterScreen())

      expect(result.current.actions.handleSelect).toBeDefined()
    })

    it('should return onGoBack action', () => {
      const { result } = renderHook(() => useTypeFilterScreen())

      expect(result.current.actions.onGoBack).toBeDefined()
    })

    it('should return loadMore action', () => {
      const mockLoadMore = jest.fn()

      mockUsePokemonByTypeGQL.mockReturnValue({
        data: [],
        totalCount: 0,
        isLoading: false,
        isFetching: false,
        isError: false,
        error: null,
        hasMore: true,
        loadMore: mockLoadMore,
        refetch: jest.fn(),
      })

      const { result } = renderHook(() => useTypeFilterScreen())

      result.current.actions.loadMore()
      expect(mockLoadMore).toHaveBeenCalled()
    })
  })

  describe('Status', () => {
    it('should return isCached false', () => {
      const { result } = renderHook(() => useTypeFilterScreen())

      expect(result.current.status.isCached).toBe(false)
    })

    it('should return isFetching from hook', () => {
      mockUsePokemonByTypeGQL.mockReturnValue({
        data: [],
        totalCount: 0,
        isLoading: false,
        isFetching: true,
        isError: false,
        error: null,
        hasMore: false,
        loadMore: jest.fn(),
        refetch: jest.fn(),
      })

      const { result } = renderHook(() => useTypeFilterScreen())

      expect(result.current.status.isFetching).toBe(true)
    })
  })

  describe('Edge cases', () => {
    it('should handle empty pokemon list', () => {
      const { result } = renderHook(() => useTypeFilterScreen())

      expect(result.current.data.filteredData).toEqual([])
      expect(result.current.data.pokemonListForRecent).toEqual([])
    })

    it('should map pokemon list for recent selection', () => {
      mockUsePokemonByTypeGQL.mockReturnValue({
        data: [
          { id: 1, name: 'bulbasaur', sprite: '', primaryType: 'grass', types: [] },
        ],
        totalCount: 1,
        isLoading: false,
        isFetching: false,
        isError: false,
        error: null,
        hasMore: false,
        loadMore: jest.fn(),
        refetch: jest.fn(),
      })

      const { result } = renderHook(() => useTypeFilterScreen())

      expect(result.current.data.pokemonListForRecent).toEqual([{ id: 1, name: 'bulbasaur' }])
    })
  })
})
