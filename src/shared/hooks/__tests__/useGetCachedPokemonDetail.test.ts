import { getQueryClient } from '@/providers/MainProvidersWrapper'
import type { GQLPokemonDetailsResponse } from '@/shared/api/queries/pokemonQueries'

jest.mock('@/providers/MainProvidersWrapper', () => {
  const mockQueryClient = {
    getQueryData: jest.fn(),
    prefetchQuery: jest.fn(),
  }
  return {
    getQueryClient: jest.fn(() => mockQueryClient),
    queryClient: mockQueryClient,
  }
})

jest.mock('@/utils/pokemon/sprites', () => ({
  getPokemonSpriteUrl: jest.fn((id: number) => `https://example.com/sprite/${id}.png`),
}))

describe('useGetCachedPokemonDetail', () => {
  const mockQueryClient = getQueryClient() as ReturnType<typeof getQueryClient> & {
    getQueryData: jest.Mock
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getCachedPokemonDetail', () => {
    it('should return undefined when no cached data exists', () => {
      ;(mockQueryClient.getQueryData as jest.Mock).mockReturnValue(undefined)

      const { getCachedPokemonDetail } = require('@/shared/hooks/useGetCachedPokemonDetail')
      const result = getCachedPokemonDetail(1)

      expect(result).toBeUndefined()
      expect(mockQueryClient.getQueryData).toHaveBeenCalledWith(['pokemonDetails', 1])
    })

    it('should return undefined when pokemon data is empty', () => {
      const emptyData = {
        pokemon_v2_pokemon: [],
      } as unknown as GQLPokemonDetailsResponse

      ;(mockQueryClient.getQueryData as jest.Mock).mockReturnValue(emptyData)

      const { getCachedPokemonDetail } = require('@/shared/hooks/useGetCachedPokemonDetail')
      const result = getCachedPokemonDetail(1)

      expect(result).toBeUndefined()
    })

    it('should transform GQL data to CombinedPokemonDetail', () => {
      const gqlData = {
        pokemon_v2_pokemon: [
          {
            id: 1,
            name: 'bulbasaur',
            height: 7,
            weight: 69,
            pokemon_v2_pokemontypes: [
              { slot: 1, pokemon_v2_type: { name: 'grass' } },
            ],
            pokemon_v2_pokemonsprites: [
              {
                sprites: JSON.stringify({
                  front_default: 'https://example.com/sprite.png',
                }),
              },
            ],
          },
        ],
      } as unknown as GQLPokemonDetailsResponse

      ;(mockQueryClient.getQueryData as jest.Mock).mockReturnValue(gqlData)

      const { getCachedPokemonDetail } = require('@/shared/hooks/useGetCachedPokemonDetail')
      const result = getCachedPokemonDetail(1)

      expect(result).toBeDefined()
      expect(result?.id).toBe(1)
      expect(result?.name).toBe('bulbasaur')
      expect(result?.types).toHaveLength(1)
      expect(result?.types[0].type.name).toBe('grass')
    })

    it('should use sprite URL fallback when no sprites data', () => {
      const gqlData = {
        pokemon_v2_pokemon: [
          {
            id: 25,
            name: 'pikachu',
            height: 4,
            weight: 60,
            pokemon_v2_pokemontypes: [
              { slot: 1, pokemon_v2_type: { name: 'electric' } },
            ],
            pokemon_v2_pokemonsprites: [],
          },
        ],
      } as unknown as GQLPokemonDetailsResponse

      ;(mockQueryClient.getQueryData as jest.Mock).mockReturnValue(gqlData)

      const { getCachedPokemonDetail } = require('@/shared/hooks/useGetCachedPokemonDetail')
      const result = getCachedPokemonDetail(25)

      expect(result).toBeDefined()
      expect(result?.sprites.front_default).toBe('https://example.com/sprite/25.png')
    })
  })
})
