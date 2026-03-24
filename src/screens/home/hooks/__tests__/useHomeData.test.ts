import { renderHook } from '@testing-library/react-native'
import { useHomeData } from '../useHomeData'

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

describe('useHomeData', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return data with pokemonListDataSet, bookmarkedPokemonIds, recentSelections, typeList', () => {
    const mockPokemonList = [
      { id: 1, name: 'bulbasaur' },
      { id: 2, name: 'ivysaur' },
    ]
    const mockBookmarkedPokemonIds = [1, 2]
    const mockRecentSelections = [
      { id: 1, name: 'bulbasaur', selectedAt: Date.now() },
    ]
    const mockTypeList = [
      { id: 1, name: 'fire' },
      { id: 2, name: 'water' },
    ]

    mockUsePokemonGeneralStore
      .mockReturnValueOnce({
        pokemonList: mockPokemonList,
        bookmarkedPokemonIds: mockBookmarkedPokemonIds,
        recentSelections: mockRecentSelections,
        removeRecentSelection: jest.fn(),
        typeList: mockTypeList,
        addRecentSelection: jest.fn(),
        toggleBookmark: jest.fn(),
      })
      .mockReturnValue({
        bookmarkedPokemonIds: mockBookmarkedPokemonIds,
        toggleBookmark: jest.fn(),
      })

    mockUsePokemonDataStore.mockReturnValue({
      fetchPokemonDetail: jest.fn(),
      getPokemonDetail: jest.fn(),
    })

    mockUsePokemonSelection.mockReturnValue({
      handleSelect: jest.fn(),
    })

    const { result } = renderHook(() => useHomeData())

    expect(result.current.data.pokemonListDataSet).toHaveLength(2)
    expect(result.current.data.bookmarkedPokemonIds).toEqual(mockBookmarkedPokemonIds)
    expect(result.current.data.recentSelections).toEqual(mockRecentSelections)
    expect(result.current.data.typeList).toEqual(mockTypeList)
  })

  it('should return actions with getPokemonDetail, toggleBookmark, removeRecentSelection, handleSelect', () => {
    const mockToggleBookmark = jest.fn()
    const mockRemoveRecentSelection = jest.fn()
    const mockGetPokemonDetail = jest.fn()
    const mockHandleSelect = jest.fn()

    mockUsePokemonGeneralStore
      .mockReturnValueOnce({
        pokemonList: [],
        bookmarkedPokemonIds: [],
        recentSelections: [],
        removeRecentSelection: mockRemoveRecentSelection,
        typeList: [],
        addRecentSelection: jest.fn(),
        toggleBookmark: mockToggleBookmark,
      })
      .mockReturnValue({
        bookmarkedPokemonIds: [],
        toggleBookmark: mockToggleBookmark,
      })

    mockUsePokemonDataStore.mockReturnValue({
      fetchPokemonDetail: jest.fn(),
      getPokemonDetail: mockGetPokemonDetail,
    })

    mockUsePokemonSelection.mockReturnValue({
      handleSelect: mockHandleSelect,
    })

    const { result } = renderHook(() => useHomeData())

    expect(result.current.actions.getPokemonDetail).toBe(mockGetPokemonDetail)
    expect(result.current.actions.toggleBookmark).toBe(mockToggleBookmark)
    expect(result.current.actions.removeRecentSelection).toBe(mockRemoveRecentSelection)
    expect(result.current.actions.handleSelect).toBe(mockHandleSelect)
  })
})
