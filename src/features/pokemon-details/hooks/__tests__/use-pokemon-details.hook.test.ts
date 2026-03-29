import { renderHook } from '@testing-library/react-native'
import { useQuery } from '@tanstack/react-query'
import { usePokemonDetailsGQL } from '../use-pokemon-details.hook'
import { createMockEvolutionChainLink, createMockPokemon } from '@/shared/tests/mocks'

const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>

jest.mock('@/utils/pokemon/statOrder', () => ({
  sortStatsByOrder: (stats: Array<{ stat: { name: string } }>) => stats,
}))

jest.mock('@/utils/pokemon/sprites', () => ({
  getPokemonSpriteUrl: jest.fn((id: number) => `https://example.com/sprite/${id}.png`),
}))

jest.mock('@/utils/api/extractId', () => ({
  extractPokemonId: jest.fn((url: string) => {
    const matches = url.match(/\/pokemon(?:-species)?\/(\d+)\/?/)
    return matches ? parseInt(matches[1], 10) : 0
  }),
}))

jest.mock('@/utils/evolution/evolutionTree', () => ({
  extractEvolutionChain: jest.fn((chain: { species: { name: string; url: string }; evolves_to: unknown[] }) => {
    return [chain.species]
  }),
}))

describe('usePokemonDetailsGQL', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Loading state', () => {
    it('should return isLoading true initially', () => {
      mockUseQuery.mockImplementation(() => ({
        data: undefined,
        isLoading: true,
        isFetching: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      }))

      const { result } = renderHook(() => usePokemonDetailsGQL({ id: 1 }))

      expect(result.current.isLoading).toBe(true)
    })

    it('should return isFetching true when fetching', () => {
      mockUseQuery.mockImplementation(() => ({
        data: undefined,
        isLoading: false,
        isFetching: true,
        isError: false,
        error: null,
        refetch: jest.fn(),
      }))

      const { result } = renderHook(() => usePokemonDetailsGQL({ id: 1 }))

      expect(result.current.isFetching).toBe(true)
    })
  })

  describe('Success state', () => {
    it('should transform GQL response to CombinedPokemonDetail', () => {
      const mockGqlData = {
        pokemon_v2_pokemon: [
          {
            id: 1,
            name: 'bulbasaur',
            height: 7,
            weight: 69,
            pokemon_v2_pokemontypes: [
              { slot: 1, pokemon_v2_type: { name: 'grass' } },
              { slot: 2, pokemon_v2_type: { name: 'poison' } },
            ],
            pokemon_v2_pokemonstats: [
              { base_stat: 45, pokemon_v2_stat: { name: 'hp' } },
              { base_stat: 49, pokemon_v2_stat: { name: 'attack' } },
            ],
            pokemon_v2_pokemonabilities: [
              { is_hidden: false, pokemon_v2_ability: { name: 'overgrow' } },
            ],
            pokemon_v2_pokemonsprites: [
              { sprites: JSON.stringify({ front_default: 'https://example.com/sprite.png' }) },
            ],
          },
        ],
      }

      mockUseQuery
        .mockReturnValueOnce({
          data: mockGqlData as never,
          isLoading: false,
          isFetching: false,
          isError: false,
          error: null,
          refetch: jest.fn(),
        })
        .mockReturnValueOnce({
          data: {
            genus: 'Seed Pokemon',
            flavorText: 'A strange seed was planted on its back.',
            habitat: 'forest',
            isLegendary: false,
            isMythical: false,
            evolutionChainUrl: 'https://pokeapi.co/api/v2/evolution-chain/1/',
          },
          isLoading: false,
          isFetching: false,
          isError: false,
          error: null,
          refetch: jest.fn(),
        })
        .mockReturnValueOnce({
          data: { flat: [], tree: null },
          isLoading: false,
          isFetching: false,
          isError: false,
          error: null,
          refetch: jest.fn(),
        })

      const { result } = renderHook(() => usePokemonDetailsGQL({ id: 1 }))

      expect(result.current.data).toBeDefined()
      expect(result.current.data?.id).toBe(1)
      expect(result.current.data?.name).toBe('bulbasaur')
      expect(result.current.data?.types).toHaveLength(2)
      expect(result.current.data?.types[0].type.name).toBe('grass')
      expect(result.current.isLoading).toBe(false)
    })

    it('should include speciesInfo with flavor text and genus', () => {
      const mockGqlData = {
        pokemon_v2_pokemon: [
          {
            id: 1,
            name: 'bulbasaur',
            height: 7,
            weight: 69,
            pokemon_v2_pokemontypes: [],
            pokemon_v2_pokemonstats: [],
            pokemon_v2_pokemonabilities: [],
            pokemon_v2_pokemonsprites: [],
          },
        ],
      }

      mockUseQuery
        .mockReturnValueOnce({
          data: mockGqlData as never,
          isLoading: false,
          isFetching: false,
          isError: false,
          error: null,
          refetch: jest.fn(),
        })
        .mockReturnValueOnce({
          data: {
            genus: 'Seed Pokemon',
            flavorText: 'A strange seed was planted on its back at birth.',
            habitat: 'forest',
            isLegendary: false,
            isMythical: false,
            evolutionChainUrl: null,
          },
          isLoading: false,
          isFetching: false,
          isError: false,
          error: null,
          refetch: jest.fn(),
        })
        .mockReturnValueOnce({
          data: { flat: [], tree: null },
          isLoading: false,
          isFetching: false,
          isError: false,
          error: null,
          refetch: jest.fn(),
        })

      const { result } = renderHook(() => usePokemonDetailsGQL({ id: 1 }))

      expect(result.current.data?.speciesInfo).toBeDefined()
      expect(result.current.data?.speciesInfo?.genus).toBe('Seed Pokemon')
      expect(result.current.data?.speciesInfo?.flavorText).toBe('A strange seed was planted on its back at birth.')
      expect(result.current.data?.speciesInfo?.habitat).toBe('forest')
    })

    it('should handle 3-level evolution chain', () => {
      const mockGqlData = {
        pokemon_v2_pokemon: [
          {
            id: 1,
            name: 'bulbasaur',
            height: 7,
            weight: 69,
            pokemon_v2_pokemontypes: [],
            pokemon_v2_pokemonstats: [],
            pokemon_v2_pokemonabilities: [],
            pokemon_v2_pokemonsprites: [],
          },
        ],
      }

      const evolutionChain = createMockEvolutionChainLink({
        species: { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' },
        evolves_to: [
          createMockEvolutionChainLink({
            species: { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon-species/2/' },
            evolves_to: [
              createMockEvolutionChainLink({
                species: { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon-species/3/' },
              }),
            ],
          }),
        ],
      })

      mockUseQuery
        .mockReturnValueOnce({
          data: mockGqlData as never,
          isLoading: false,
          isFetching: false,
          isError: false,
          error: null,
          refetch: jest.fn(),
        })
        .mockReturnValueOnce({
          data: {
            genus: 'Seed Pokemon',
            flavorText: 'Test',
            habitat: null,
            isLegendary: false,
            isMythical: false,
            evolutionChainUrl: 'https://pokeapi.co/api/v2/evolution-chain/1/',
          },
          isLoading: false,
          isFetching: false,
          isError: false,
          error: null,
          refetch: jest.fn(),
        })
        .mockReturnValueOnce({
          data: { flat: [{ id: 1, name: 'bulbasaur' }, { id: 2, name: 'ivysaur' }, { id: 3, name: 'venusaur' }], tree: evolutionChain },
          isLoading: false,
          isFetching: false,
          isError: false,
          error: null,
          refetch: jest.fn(),
        })

      const { result } = renderHook(() => usePokemonDetailsGQL({ id: 1 }))

      expect(result.current.data?.evolutionChain).toHaveLength(3)
      expect(result.current.data?.evolutionChainTree).toBeDefined()
    })
  })

  describe('Error state', () => {
    it('should return isError true when query fails', () => {
      const mockError = new Error('Network error')

      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isFetching: false,
        isError: true,
        error: mockError,
        refetch: jest.fn(),
      })

      const { result } = renderHook(() => usePokemonDetailsGQL({ id: 1 }))

      expect(result.current.isError).toBe(true)
      expect(result.current.error).toBe(mockError)
    })

    it('should return empty data when pokemon not found (404)', () => {
      const mockGqlData = {
        pokemon_v2_pokemon: [],
      }

      mockUseQuery
        .mockReturnValueOnce({
          data: mockGqlData as never,
          isLoading: false,
          isFetching: false,
          isError: false,
          error: null,
          refetch: jest.fn(),
        })
        .mockReturnValueOnce({
          data: null,
          isLoading: false,
          isFetching: false,
          isError: false,
          error: null,
          refetch: jest.fn(),
        })
        .mockReturnValueOnce({
          data: { flat: [], tree: null },
          isLoading: false,
          isFetching: false,
          isError: false,
          error: null,
          refetch: jest.fn(),
        })

      const { result } = renderHook(() => usePokemonDetailsGQL({ id: 99999 }))

      expect(result.current.data).toBeUndefined()
    })
  })

  describe('Edge cases', () => {
    it('should handle missing sprites gracefully', () => {
      const mockGqlData = {
        pokemon_v2_pokemon: [
          {
            id: 1,
            name: 'bulbasaur',
            height: 7,
            weight: 69,
            pokemon_v2_pokemontypes: [],
            pokemon_v2_pokemonstats: [],
            pokemon_v2_pokemonabilities: [],
            pokemon_v2_pokemonsprites: [],
          },
        ],
      }

      mockUseQuery
        .mockReturnValueOnce({
          data: mockGqlData as never,
          isLoading: false,
          isFetching: false,
          isError: false,
          error: null,
          refetch: jest.fn(),
        })
        .mockReturnValueOnce({
          data: null,
          isLoading: false,
          isFetching: false,
          isError: false,
          error: null,
          refetch: jest.fn(),
        })
        .mockReturnValueOnce({
          data: { flat: [], tree: null },
          isLoading: false,
          isFetching: false,
          isError: false,
          error: null,
          refetch: jest.fn(),
        })

      const { result } = renderHook(() => usePokemonDetailsGQL({ id: 1 }))

      expect(result.current.data?.sprites.front_default).toContain('sprite/1.png')
    })

    it('should handle disabled query', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isFetching: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      })

      const { result } = renderHook(() => usePokemonDetailsGQL({ id: 0, enabled: false }))

      expect(result.current.data).toBeUndefined()
    })
  })
})
