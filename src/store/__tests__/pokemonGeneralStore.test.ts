import { usePokemonGeneralStore } from '../pokemonGeneralStore'
import { fetchPokemonList, fetchPokemonByType } from 'src/services/api'

jest.mock('src/services/api', () => ({
  fetchPokemonList: jest.fn(),
  fetchPokemonByType: jest.fn(),
}))

jest.mock('../pokemonDataStore', () => ({
  usePokemonDataStore: {
    getState: () => ({
      pokemonDetails: {},
    }),
  },
}))

jest.mock('src/utils/pokemon/displayData', () => ({
  getPokemonDisplayData: jest.fn(() => []),
}))

const mockFetchPokemonList = fetchPokemonList as jest.MockedFunction<typeof fetchPokemonList>
const mockFetchPokemonByType = fetchPokemonByType as jest.MockedFunction<typeof fetchPokemonByType>

describe('pokemonGeneralStore', () => {
  beforeEach(() => {
    usePokemonGeneralStore.getState().$reset()
    jest.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have correct default values', () => {
      const state = usePokemonGeneralStore.getState()

      expect(state.pokemonList).toEqual([])
      expect(state.typeList).toEqual([])
      expect(state.recentSelections).toEqual([])
      expect(state.bookmarkedPokemonIds).toEqual([])
      expect(state.pokemonByType).toEqual({})
    })
  })

  describe('fetchPokemonListAction', () => {
    it('should update pokemonList on successful fetch', async () => {
      const mockList = [
        { id: 1, name: 'bulbasaur' },
        { id: 2, name: 'ivysaur' },
      ]
      mockFetchPokemonList.mockResolvedValueOnce(mockList)

      await usePokemonGeneralStore.getState().fetchPokemonListAction()

      const state = usePokemonGeneralStore.getState()
      expect(state.pokemonList).toEqual(mockList)
      expect(mockFetchPokemonList).toHaveBeenCalledTimes(1)
    })

    it('should not fetch if list is already loaded', async () => {
      usePokemonGeneralStore.setState({
        pokemonList: [{ id: 1, name: 'existing' }],
      })

      await usePokemonGeneralStore.getState().fetchPokemonListAction()

      expect(mockFetchPokemonList).not.toHaveBeenCalled()
    })

    it('should handle error silently', async () => {
      mockFetchPokemonList.mockRejectedValueOnce(new Error('Network error'))

      await usePokemonGeneralStore.getState().fetchPokemonListAction()

      const state = usePokemonGeneralStore.getState()
      expect(state.pokemonList).toEqual([])
    })
  })

  describe('setTypeList', () => {
    it('should filter out stellar type', () => {
      const mockTypes = [
        { id: 1, name: 'fire' },
        { id: 2, name: 'water' },
        { id: 10000, name: 'stellar' },
      ]

      usePokemonGeneralStore.getState().setTypeList(mockTypes)

      const state = usePokemonGeneralStore.getState()
      expect(state.typeList).toEqual([
        { id: 1, name: 'fire' },
        { id: 2, name: 'water' },
      ])
    })
  })

  describe('recent selections', () => {
    it('addRecentSelection should add pokemon to beginning', () => {
      const pokemon = { id: 1, name: 'bulbasaur' }

      usePokemonGeneralStore.getState().addRecentSelection(pokemon)

      const state = usePokemonGeneralStore.getState()
      expect(state.recentSelections).toHaveLength(1)
      expect(state.recentSelections[0].id).toBe(1)
    })

    it('addRecentSelection should remove duplicates and limit to 5', () => {
      const pokemon1 = { id: 1, name: 'bulbasaur' }
      const pokemon2 = { id: 2, name: 'ivysaur' }
      const pokemon3 = { id: 3, name: 'venusaur' }
      const pokemon4 = { id: 4, name: 'charmander' }
      const pokemon5 = { id: 5, name: 'charmeleon' }
      const pokemon6 = { id: 6, name: 'charizard' }

      usePokemonGeneralStore.getState().addRecentSelection(pokemon1)
      usePokemonGeneralStore.getState().addRecentSelection(pokemon2)
      usePokemonGeneralStore.getState().addRecentSelection(pokemon3)
      usePokemonGeneralStore.getState().addRecentSelection(pokemon4)
      usePokemonGeneralStore.getState().addRecentSelection(pokemon5)
      usePokemonGeneralStore.getState().addRecentSelection(pokemon6)
      usePokemonGeneralStore.getState().addRecentSelection(pokemon1)

      const state = usePokemonGeneralStore.getState()
      expect(state.recentSelections).toHaveLength(5)
      expect(state.recentSelections[0].id).toBe(1)
    })

    it('removeRecentSelection should remove pokemon from list', () => {
      usePokemonGeneralStore.setState({
        recentSelections: [
          { id: 1, name: 'bulbasaur', selectedAt: Date.now() },
        ],
      })

      usePokemonGeneralStore.getState().removeRecentSelection(1)

      const state = usePokemonGeneralStore.getState()
      expect(state.recentSelections).toEqual([])
    })
  })

  describe('bookmarks', () => {
    it('toggleBookmark should add bookmark', () => {
      usePokemonGeneralStore.getState().toggleBookmark(1)

      const state = usePokemonGeneralStore.getState()
      expect(state.bookmarkedPokemonIds).toContain(1)
    })

    it('toggleBookmark should remove bookmark if already bookmarked', () => {
      usePokemonGeneralStore.setState({ bookmarkedPokemonIds: [1, 2] })

      usePokemonGeneralStore.getState().toggleBookmark(1)

      const state = usePokemonGeneralStore.getState()
      expect(state.bookmarkedPokemonIds).toEqual([2])
    })
  })

  describe('cache operations', () => {
    it('isTypeCached should return true if type is cached', () => {
      usePokemonGeneralStore.setState({
        pokemonByType: {
          fire: [{ id: 1, name: 'charmander' }],
        } as never,
      })

      const result = usePokemonGeneralStore.getState().isTypeCached('fire')

      expect(result).toBe(true)
    })

    it('isTypeCached should return false if type not cached', () => {
      const result = usePokemonGeneralStore.getState().isTypeCached('fire')

      expect(result).toBe(false)
    })

    it('clearTypeCache should clear specific type', () => {
      usePokemonGeneralStore.setState({
        pokemonByType: {
          fire: [{ id: 1, name: 'charmander' }],
          water: [{ id: 2, name: 'squirtle' }],
        } as never,
      })

      usePokemonGeneralStore.getState().clearTypeCache('fire')

      const state = usePokemonGeneralStore.getState()
      expect(state.pokemonByType.fire).toBeUndefined()
      expect(state.pokemonByType.water).toEqual([{ id: 2, name: 'squirtle' }])
    })

    it('clearTypeCache should clear all types when no argument', () => {
      usePokemonGeneralStore.setState({
        pokemonByType: {
          fire: [{ id: 1, name: 'charmander' }],
          water: [{ id: 2, name: 'squirtle' }],
        } as never,
      })

      usePokemonGeneralStore.getState().clearTypeCache()

      const state = usePokemonGeneralStore.getState()
      expect(state.pokemonByType).toEqual({})
    })
  })

  describe('$reset', () => {
    it('should reset all state to defaults', () => {
      usePokemonGeneralStore.setState({
        pokemonList: [{ id: 1, name: 'test' }],
        typeList: [{ id: 1, name: 'fire' }],
        recentSelections: [{ id: 1, name: 'test', selectedAt: Date.now() }],
        bookmarkedPokemonIds: [1],
        pokemonByType: { fire: [{ id: 1, name: 'test' }] } as never,
      })

      usePokemonGeneralStore.getState().$reset()

      const state = usePokemonGeneralStore.getState()
      expect(state.pokemonList).toEqual([])
      expect(state.typeList).toEqual([])
      expect(state.recentSelections).toEqual([])
      expect(state.bookmarkedPokemonIds).toEqual([])
      expect(state.pokemonByType).toEqual({})
    })
  })
})
