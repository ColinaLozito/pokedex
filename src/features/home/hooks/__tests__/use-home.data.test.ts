import { renderHook, act } from '@testing-library/react-native'
import { useHomeData } from '../use-home.data'
import { usePokemonTypesGQL } from '../use-pokemon-types.hook'
import { usePokemonSearchGQL } from '../use-pokemon-search.hook'
import { useGetCachedPokemonDetail } from '@/shared/hooks/useGetCachedPokemonDetail'
import { usePokemonSelection } from '@/shared/hooks/usePokemonSelection'
import { useUserStore } from '@/store/userStore'

const mockUsePokemonTypesGQL = usePokemonTypesGQL as jest.MockedFunction<typeof usePokemonTypesGQL>
const mockUsePokemonSearchGQL = usePokemonSearchGQL as jest.MockedFunction<typeof usePokemonSearchGQL>
const mockUseGetCachedPokemonDetail = useGetCachedPokemonDetail as jest.MockedFunction<typeof useGetCachedPokemonDetail>
const mockUsePokemonSelection = usePokemonSelection as jest.MockedFunction<typeof usePokemonSelection>
const mockUseUserStore = useUserStore as jest.MockedFunction<typeof useUserStore>

jest.mock('../use-pokemon-types.hook')
jest.mock('../use-pokemon-search.hook')
jest.mock('@/shared/hooks/useGetCachedPokemonDetail')
jest.mock('@/shared/hooks/usePokemonSelection')
jest.mock('@/store/userStore')

describe('useHomeData', () => {
  const mockGetPokemonDetail = jest.fn()
  const mockToggleBookmark = jest.fn()
  const mockRemoveRecentSelection = jest.fn()
  const mockAddRecentSelection = jest.fn()
  const mockHandleSelect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()

    mockUsePokemonTypesGQL.mockReturnValue({
      data: [
        { id: 1, name: 'fire' },
        { id: 2, name: 'water' },
      ],
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    })

    mockUsePokemonSearchGQL.mockReturnValue({
      suggestions: [],
      isLoading: false,
      isError: false,
      hasResults: false,
    })

    mockUseGetCachedPokemonDetail.mockReturnValue(mockGetPokemonDetail)

    mockUsePokemonSelection.mockReturnValue({
      isLoading: false,
      handleSelect: mockHandleSelect,
    } as never)

    mockUseUserStore.mockReturnValue({
      bookmarkedPokemonIds: [],
      recentSelections: [],
      removeRecentSelection: mockRemoveRecentSelection,
      addRecentSelection: mockAddRecentSelection,
      toggleBookmark: mockToggleBookmark,
    })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('Initial state', () => {
    it('should return initial data structure', () => {
      const { result } = renderHook(() => useHomeData())

      expect(result.current.data).toBeDefined()
      expect(result.current.data.pokemonListDataSet).toEqual([])
      expect(result.current.data.bookmarkedPokemonIds).toEqual([])
      expect(result.current.data.recentSelections).toEqual([])
      expect(result.current.data.typeList).toHaveLength(2)
      expect(result.current.data.searchResults).toEqual([])
      expect(result.current.data.isSearchLoading).toBe(false)
    })

    it('should return actions with required functions', () => {
      const { result } = renderHook(() => useHomeData())

      expect(result.current.actions.getPokemonDetail).toBeDefined()
      expect(result.current.actions.toggleBookmark).toBeDefined()
      expect(result.current.actions.removeRecentSelection).toBeDefined()
      expect(result.current.actions.handleSelect).toBeDefined()
      expect(result.current.actions.onSearchChange).toBeDefined()
    })
  })

  describe('Search functionality', () => {
    it('should update search term when onSearchChange is called', () => {
      const { result } = renderHook(() => useHomeData())

      act(() => {
        result.current.actions.onSearchChange('pikachu')
      })

      expect(result.current.data.searchResults).toEqual([])
    })

    it('should update data when search term changes', () => {
      mockUsePokemonSearchGQL.mockReturnValue({
        suggestions: [
          { id: '25', title: 'pikachu' },
        ],
        isLoading: true,
        isError: false,
        hasResults: true,
      })

      const { result, rerender } = renderHook(() => useHomeData())

      act(() => {
        result.current.actions.onSearchChange('pika')
      })

      rerender()

      expect(result.current.data.isSearchLoading).toBe(true)
      expect(result.current.data.searchResults).toHaveLength(1)
    })
  })

  describe('Type list', () => {
    it('should return type list from usePokemonTypesGQL', () => {
      mockUsePokemonTypesGQL.mockReturnValue({
        data: [
          { id: 10, name: 'grass' },
          { id: 11, name: 'electric' },
        ],
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      })

      const { result } = renderHook(() => useHomeData())

      expect(result.current.data.typeList).toHaveLength(2)
      expect(result.current.data.typeList).toContainEqual({ id: 10, name: 'grass' })
    })
  })

  describe('Bookmarks and recent selections', () => {
    it('should return bookmarked IDs from store', () => {
      mockUseUserStore.mockReturnValue({
        bookmarkedPokemonIds: [1, 2, 3],
        recentSelections: [],
        removeRecentSelection: mockRemoveRecentSelection,
        addRecentSelection: mockAddRecentSelection,
        toggleBookmark: mockToggleBookmark,
      })

      const { result } = renderHook(() => useHomeData())

      expect(result.current.data.bookmarkedPokemonIds).toEqual([1, 2, 3])
    })

    it('should return recent selections from store', () => {
      const mockRecentSelections = [
        { id: 1, name: 'bulbasaur', selectedAt: Date.now() },
      ]

      mockUseUserStore.mockReturnValue({
        bookmarkedPokemonIds: [],
        recentSelections: mockRecentSelections,
        removeRecentSelection: mockRemoveRecentSelection,
        addRecentSelection: mockAddRecentSelection,
        toggleBookmark: mockToggleBookmark,
      })

      const { result } = renderHook(() => useHomeData())

      expect(result.current.data.recentSelections).toEqual(mockRecentSelections)
    })
  })

  describe('Actions', () => {
    it('should call toggleBookmark when triggered', () => {
      const { result } = renderHook(() => useHomeData())

      result.current.actions.toggleBookmark(1)

      expect(mockToggleBookmark).toHaveBeenCalledWith(1)
    })

    it('should call removeRecentSelection when triggered', () => {
      const { result } = renderHook(() => useHomeData())

      result.current.actions.removeRecentSelection(1)

      expect(mockRemoveRecentSelection).toHaveBeenCalledWith(1)
    })

    it('should call handleSelect when triggered', async () => {
      const { result } = renderHook(() => useHomeData())

      await result.current.actions.handleSelect(1)

      expect(mockHandleSelect).toHaveBeenCalledWith(1)
    })
  })

  describe('Edge cases', () => {
    it('should handle empty type list', () => {
      mockUsePokemonTypesGQL.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      })

      const { result } = renderHook(() => useHomeData())

      expect(result.current.data.typeList).toEqual([])
    })
  })
})
