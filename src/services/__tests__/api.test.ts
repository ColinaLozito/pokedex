import {
  fetchPokemonList,
  fetchPokemonById,
  fetchPokemonSpecies,
  fetchEvolutionChain,
  fetchTypeList,
  fetchPokemonByType,
  fetchCompletePokemonDetail,
} from '../api'

const BASE_URL = 'https://pokeapi.co/api/v2/'

const mockFetch = jest.fn()

global.fetch = mockFetch

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('fetchPokemonList', () => {
    it('should call correct URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [] }),
      })

      await fetchPokemonList()

      expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}pokemon?limit=2000`)
    })

    it('should transform response correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
            { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
          ],
        }),
      })

      const result = await fetchPokemonList()

      expect(result).toEqual([
        { id: 1, name: 'bulbasaur' },
        { id: 2, name: 'ivysaur' },
      ])
    })

    it('should handle empty results', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: null }),
      })

      const result = await fetchPokemonList()

      expect(result).toEqual([])
    })

    it('should throw on 404 error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      await expect(fetchPokemonList()).rejects.toThrow('Failed to fetch Pokemon list: 404')
    })

    it('should throw on 500 error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      await expect(fetchPokemonList()).rejects.toThrow('Failed to fetch Pokemon list: 500')
    })

    it('should throw on network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(fetchPokemonList()).rejects.toThrow('Network error')
    })
  })

  describe('fetchPokemonById', () => {
    it('should call correct URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 25, name: 'pikachu' }),
      })

      await fetchPokemonById(25)

      expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}pokemon/25`)
    })

    it('should return pokemon data', async () => {
      const mockData = { id: 25, name: 'pikachu', height: 4, weight: 60 }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      })

      const result = await fetchPokemonById(25)

      expect(result).toEqual(mockData)
    })

    it('should throw on 404 error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      await expect(fetchPokemonById(999999)).rejects.toThrow('Failed to fetch Pokémon: 404')
    })

    it('should throw on 500 error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      await expect(fetchPokemonById(1)).rejects.toThrow('Failed to fetch Pokémon: 500')
    })
  })

  describe('fetchPokemonSpecies', () => {
    it('should call correct URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1, name: 'bulbasaur' }),
      })

      await fetchPokemonSpecies(1)

      expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}pokemon-species/1`)
    })

    it('should return species data', async () => {
      const mockData = { id: 1, name: 'bulbasaur', flavor_text_entries: [] }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      })

      const result = await fetchPokemonSpecies(1)

      expect(result).toEqual(mockData)
    })

    it('should throw on 404 error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      await expect(fetchPokemonSpecies(999999)).rejects.toThrow('Failed to fetch species: 404')
    })
  })

  describe('fetchEvolutionChain', () => {
    it('should call correct URL', async () => {
      const url = 'https://pokeapi.co/api/v2/evolution-chain/1/'
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ chain: { species: { name: 'bulbasaur', url: '' }, evolves_to: [] } }),
      })

      await fetchEvolutionChain(url)

      expect(mockFetch).toHaveBeenCalledWith(url)
    })

    it('should return evolution chain data', async () => {
      const mockData = { chain: { species: { name: 'bulbasaur', url: '' }, evolves_to: [] } }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      })

      const result = await fetchEvolutionChain('https://pokeapi.co/api/v2/evolution-chain/1/')

      expect(result).toEqual(mockData)
    })

    it('should throw on 404 error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      await expect(fetchEvolutionChain('https://pokeapi.co/api/v2/evolution-chain/999/')).rejects.toThrow(
        'Failed to fetch evolution chain: 404'
      )
    })
  })

  describe('fetchTypeList', () => {
    it('should call correct URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [] }),
      })

      await fetchTypeList()

      expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}type`)
    })

    it('should transform and filter response correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            { name: 'fire', url: 'https://pokeapi.co/api/v2/type/1/' },
            { name: 'water', url: 'https://pokeapi.co/api/v2/type/2/' },
            { name: 'unknown', url: 'https://pokeapi.co/api/v2/type/10000/' },
            { name: 'shadow', url: 'https://pokeapi.co/api/v2/type/10001/' },
            { name: 'stellar', url: 'https://pokeapi.co/api/v2/type/10002/' },
          ],
        }),
      })

      const result = await fetchTypeList()

      expect(result).toEqual([
        { id: 1, name: 'fire' },
        { id: 2, name: 'water' },
      ])
    })

    it('should handle empty results', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: null }),
      })

      const result = await fetchTypeList()

      expect(result).toEqual([])
    })

    it('should throw on 404 error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      await expect(fetchTypeList()).rejects.toThrow('Failed to fetch type list: 404')
    })
  })

  describe('fetchPokemonByType', () => {
    it('should call correct URL with type name', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ pokemon: [] }),
      })

      await fetchPokemonByType('fire')

      expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}type/fire`)
    })

    it('should call correct URL with type id', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ pokemon: [] }),
      })

      await fetchPokemonByType(1)

      expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}type/1`)
    })

    it('should transform response correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          pokemon: [
            { pokemon: { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' } },
            { pokemon: { name: 'charmeleon', url: 'https://pokeapi.co/api/v2/pokemon/5/' } },
          ],
        }),
      })

      const result = await fetchPokemonByType('fire')

      expect(result).toEqual([
        { id: 4, name: 'charmander' },
        { id: 5, name: 'charmeleon' },
      ])
    })

    it('should throw on 404 error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      await expect(fetchPokemonByType('nonexistent')).rejects.toThrow('Failed to fetch type: 404')
    })
  })

  describe('fetchCompletePokemonDetail', () => {
    it('should fetch and combine pokemon, species, and evolution data', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            id: 1,
            name: 'bulbasaur',
            height: 7,
            weight: 69,
            sprites: { front_default: 'url', front_shiny: null },
            types: [],
            stats: [],
            abilities: [],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            flavor_text_entries: [{ language: { name: 'en' }, flavor_text: 'A strange seed...' }],
            genera: [{ language: { name: 'en' }, genus: 'Seed Pokémon' }],
            habitat: { name: 'forest' },
            is_legendary: false,
            is_mythical: false,
            evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/1/' },
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            chain: {
              species: { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' },
              evolves_to: [
                {
                  species: { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon-species/2/' },
                  evolves_to: [],
                },
              ],
            },
          }),
        })

      const result = await fetchCompletePokemonDetail(1)

      expect(result.id).toBe(1)
      expect(result.name).toBe('bulbasaur')
      expect(result.speciesInfo).toEqual({
        genus: 'Seed Pokémon',
        flavorText: 'A strange seed...',
        habitat: 'forest',
        isLegendary: false,
        isMythical: false,
      })
      expect(result.evolutionChain).toEqual([
        { id: 1, name: 'bulbasaur' },
        { id: 2, name: 'ivysaur' },
      ])
    })

    it('should handle missing English flavor text', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            id: 1,
            name: 'bulbasaur',
            height: 7,
            weight: 69,
            sprites: { front_default: 'url', front_shiny: null },
            types: [],
            stats: [],
            abilities: [],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            flavor_text_entries: [],
            genera: [],
            habitat: null,
            is_legendary: false,
            is_mythical: false,
            evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/1/' },
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            chain: {
              species: { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' },
              evolves_to: [],
            },
          }),
        })

      const result = await fetchCompletePokemonDetail(1)

      expect(result.speciesInfo.flavorText).toBe('No description available.')
      expect(result.speciesInfo.genus).toBe('Unknown')
      expect(result.speciesInfo.habitat).toBeNull()
    })

    it('should throw when pokemon fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      await expect(fetchCompletePokemonDetail(999999)).rejects.toThrow('Failed to fetch Pokémon: 404')
    })

    it('should throw when species fetch fails', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            id: 1,
            name: 'bulbasaur',
            height: 7,
            weight: 69,
            sprites: { front_default: 'url', front_shiny: null },
            types: [],
            stats: [],
            abilities: [],
          }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
        })

      await expect(fetchCompletePokemonDetail(1)).rejects.toThrow('Failed to fetch species: 404')
    })

    it('should throw when evolution chain fetch fails', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            id: 1,
            name: 'bulbasaur',
            height: 7,
            weight: 69,
            sprites: { front_default: 'url', front_shiny: null },
            types: [],
            stats: [],
            abilities: [],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            flavor_text_entries: [],
            genera: [],
            habitat: null,
            is_legendary: false,
            is_mythical: false,
            evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/1/' },
          }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
        })

      await expect(fetchCompletePokemonDetail(1)).rejects.toThrow('Failed to fetch evolution chain: 500')
    })
  })
})
