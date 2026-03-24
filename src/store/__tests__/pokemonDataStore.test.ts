import { usePokemonDataStore } from '../pokemonDataStore'
import { fetchCompletePokemonDetail } from 'src/services/api'
import type { CombinedPokemonDetail } from 'src/services/types'

jest.mock('src/services/api', () => ({
  fetchCompletePokemonDetail: jest.fn(),
}))

jest.mock('src/utils/ui/toast', () => ({
  showToast: jest.fn(),
}))

const mockFetchCompletePokemonDetail = fetchCompletePokemonDetail as jest.MockedFunction<typeof fetchCompletePokemonDetail>

const createMockPokemonDetail = (id: number): CombinedPokemonDetail => ({
  id,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  sprites: {
    front_default: 'https://example.com/bulbasaur.png',
    front_shiny: null,
    other: {
      'official-artwork': {
        front_default: 'https://example.com/bulbasaur-official.png',
      },
      home: {
        front_default: 'https://example.com/bulbasaur-home.png',
      },
    },
  },
  types: [{ slot: 1, type: { name: 'grass', url: 'https://pokeapi.co/api/v2/type/1/' } }],
  stats: [],
  abilities: [],
  speciesInfo: {
    genus: 'Seed Pokémon',
    flavorText: 'A strange seed was planted on its back.',
    habitat: 'forest',
    isLegendary: false,
    isMythical: false,
  },
  evolutionChain: [
    { id: 1, name: 'bulbasaur' },
    { id: 2, name: 'ivysaur' },
    { id: 3, name: 'venusaur' },
  ],
  evolutionChainTree: {} as never,
})

describe('pokemonDataStore', () => {
  beforeEach(() => {
    jest.resetModules()
    usePokemonDataStore.getState().$reset()
    jest.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have correct default values', () => {
      const state = usePokemonDataStore.getState()

      expect(state.pokemonDetails).toEqual({})
      expect(state.currentPokemonId).toBeNull()
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('fetchPokemonDetail', () => {
    it('should fetch and cache Pokemon on first call', async () => {
      const mockDetail = createMockPokemonDetail(1)
      mockFetchCompletePokemonDetail.mockResolvedValueOnce(mockDetail)

      const result = await usePokemonDataStore.getState().fetchPokemonDetail(1)

      expect(result).toEqual(mockDetail)
      expect(mockFetchCompletePokemonDetail).toHaveBeenCalledWith(1)
    })

    it('should return cached data on second call without API call', async () => {
      const mockDetail = createMockPokemonDetail(1)
      mockFetchCompletePokemonDetail
        .mockResolvedValueOnce(mockDetail)
        .mockResolvedValueOnce(createMockPokemonDetail(2))
        .mockResolvedValueOnce(createMockPokemonDetail(3))
        .mockResolvedValueOnce(createMockPokemonDetail(4))

      const result1 = await usePokemonDataStore.getState().fetchPokemonDetail(1)
      const result2 = await usePokemonDataStore.getState().fetchPokemonDetail(1)

      expect(result1).toEqual(result2)
      expect(result1.id).toBe(1)
    })

    it('should set loading state during fetch', async () => {
      const mockDetail = createMockPokemonDetail(1)
      let fetchPromise: Promise<CombinedPokemonDetail>

      mockFetchCompletePokemonDetail.mockImplementation(() => {
        fetchPromise = new Promise((resolve) => {
          setTimeout(() => resolve(mockDetail), 100)
        })
        return fetchPromise!
      })

      const fetchPromiseResult = usePokemonDataStore.getState().fetchPokemonDetail(1)

      expect(usePokemonDataStore.getState().loading).toBe(true)

      await fetchPromiseResult

      expect(usePokemonDataStore.getState().loading).toBe(false)
    })

    it('should handle error and set error state', async () => {
      mockFetchCompletePokemonDetail.mockRejectedValueOnce(
        new Error('Pokemon not found')
      )

      await expect(
        usePokemonDataStore.getState().fetchPokemonDetail(999)
      ).rejects.toThrow('Pokemon not found')

      const state = usePokemonDataStore.getState()
      expect(state.error).toBe('Pokemon not found')
    })

    it('should clear error at start of new fetch', async () => {
      usePokemonDataStore.setState({ error: 'Previous error' })

      const mockDetail = createMockPokemonDetail(1)
      mockFetchCompletePokemonDetail.mockResolvedValueOnce(mockDetail)

      await usePokemonDataStore.getState().fetchPokemonDetail(1)

      const state = usePokemonDataStore.getState()
      expect(state.error).toBeNull()
    })
  })

  describe('getPokemonDetail', () => {
    it('should return cached Pokemon', () => {
      const mockDetail = createMockPokemonDetail(1)
      usePokemonDataStore.setState({
        pokemonDetails: {
          1: mockDetail,
        },
      })

      const result = usePokemonDataStore.getState().getPokemonDetail(1)

      expect(result).toEqual(mockDetail)
    })

    it('should return undefined for non-cached Pokemon', () => {
      const result = usePokemonDataStore.getState().getPokemonDetail(999)

      expect(result).toBeUndefined()
    })
  })

  describe('current Pokemon operations', () => {
    it('setCurrentPokemonId should update current Pokemon', () => {
      usePokemonDataStore.getState().setCurrentPokemonId(1)

      expect(usePokemonDataStore.getState().currentPokemonId).toBe(1)
    })

    it('getCurrentPokemon should return current Pokemon', () => {
      const mockDetail = createMockPokemonDetail(1)
      usePokemonDataStore.setState({
        currentPokemonId: 1,
        pokemonDetails: {
          1: mockDetail,
        },
      })

      const result = usePokemonDataStore.getState().getCurrentPokemon()

      expect(result).toEqual(mockDetail)
    })

    it('getCurrentPokemon should return undefined when no current Pokemon', () => {
      const result = usePokemonDataStore.getState().getCurrentPokemon()

      expect(result).toBeUndefined()
    })
  })

  describe('clearError', () => {
    it('should clear error state', () => {
      usePokemonDataStore.setState({ error: 'Some error' })

      usePokemonDataStore.getState().clearError()

      expect(usePokemonDataStore.getState().error).toBeNull()
    })
  })

  describe('$reset', () => {
    it('should reset all state to defaults', () => {
      const mockDetail = createMockPokemonDetail(1)
      usePokemonDataStore.setState({
        pokemonDetails: { 1: mockDetail },
        currentPokemonId: 1,
        loading: true,
        error: 'Some error',
      })

      usePokemonDataStore.getState().$reset()

      const state = usePokemonDataStore.getState()
      expect(state.pokemonDetails).toEqual({})
      expect(state.currentPokemonId).toBeNull()
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('cache logic', () => {
    it('should deduplicate concurrent fetches for same Pokemon', async () => {
      const mockDetail = createMockPokemonDetail(1)
      mockFetchCompletePokemonDetail
        .mockResolvedValueOnce(mockDetail)
        .mockResolvedValueOnce(createMockPokemonDetail(2))
        .mockResolvedValueOnce(createMockPokemonDetail(3))
        .mockResolvedValueOnce(createMockPokemonDetail(4))

      const promise1 = usePokemonDataStore.getState().fetchPokemonDetail(1)
      const promise2 = usePokemonDataStore.getState().fetchPokemonDetail(1)

      const [result1, result2] = await Promise.all([promise1, promise2])

      expect(result1.id).toBe(1)
      expect(result2.id).toBe(1)
      expect(result1).toEqual(result2)
    })
  })
})
