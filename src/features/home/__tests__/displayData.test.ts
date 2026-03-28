import { getPokemonDisplayData, transformPokemonToDisplayData } from '@/utils/pokemon/displayData'
import {
  createMockPokemon,
  createMockPokemonListItem,
} from '@/shared/tests/mocks'

jest.mock('@/utils/pokemon/sprites', () => ({
  getPokemonSprite: jest.fn((_data, id) => `https://example.com/sprite/${id}.png`),
  getPokemonSpriteUrl: jest.fn((id) => `https://example.com/sprite/${id}.png`),
}))

describe('displayData', () => {
  describe('getPokemonDisplayData', () => {
    it('should transform pokemon list with cached details', () => {
      const pokemonList = [
        createMockPokemonListItem({ id: 1, name: 'bulbasaur' }),
        createMockPokemonListItem({ id: 2, name: 'ivysaur' }),
      ]

      const pokemonDetails = {
        1: createMockPokemon({
          id: 1,
          name: 'bulbasaur',
          types: [{ slot: 1, type: { name: 'grass', url: '' } }],
        }),
      }

      const result = getPokemonDisplayData(pokemonList, pokemonDetails)

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe(1)
      expect(result[0].primaryType).toBe('grass')
      expect(result[1].primaryType).toBe('normal')
    })

    it('should use fallback type when no cached data', () => {
      const pokemonList = [createMockPokemonListItem({ id: 3, name: 'venusaur' })]
      const pokemonDetails = {}

      const result = getPokemonDisplayData(pokemonList, pokemonDetails, 'poison')

      expect(result[0].primaryType).toBe('poison')
    })

    it('should use normal as default fallback type', () => {
      const pokemonList = [createMockPokemonListItem({ id: 3, name: 'venusaur' })]
      const pokemonDetails = {}

      const result = getPokemonDisplayData(pokemonList, pokemonDetails)

      expect(result[0].primaryType).toBe('normal')
    })
  })

  describe('transformPokemonToDisplayData', () => {
    it('should transform with cached data', () => {
      const getPokemonDetail = (id: number) => {
        if (id === 1) {
          return createMockPokemon({
            id: 1,
            name: 'bulbasaur',
            types: [{ slot: 1, type: { name: 'grass', url: '' } }],
          })
        }
        return undefined
      }

      const result = transformPokemonToDisplayData(1, 'unknown', getPokemonDetail)

      expect(result.id).toBe(1)
      expect(result.name).toBe('bulbasaur')
      expect(result.primaryType).toBe('grass')
    })

    it('should fallback to ID-based URL when no cached data', () => {
      const getPokemonDetail = () => undefined

      const result = transformPokemonToDisplayData(25, 'pikachu', getPokemonDetail)

      expect(result.id).toBe(25)
      expect(result.name).toBe('pikachu')
      expect(result.primaryType).toBeUndefined()
    })
  })
})
