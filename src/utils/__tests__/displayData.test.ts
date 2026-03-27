import type { PokemonListItem, CombinedPokemonDetail } from 'src/shared/types/pokemon.domain'
import { getPokemonDisplayData, transformPokemonToDisplayData } from '../pokemon/displayData'

jest.mock('../pokemon/sprites', () => ({
  getPokemonSprite: jest.fn((data, id) => `https://example.com/sprite/${id}.png`),
  getPokemonSpriteUrl: jest.fn((id) => `https://example.com/sprite/${id}.png`),
}))

describe('displayData', () => {
  describe('getPokemonDisplayData', () => {
    it('should transform pokemon list with cached details', () => {
      const pokemonList: PokemonListItem[] = [
        { id: 1, name: 'bulbasaur' },
        { id: 2, name: 'ivysaur' },
      ]

      const pokemonDetails: Record<number, CombinedPokemonDetail> = {
        1: {
          id: 1,
          name: 'bulbasaur',
          height: 7,
          weight: 69,
          sprites: {} as never,
          types: [{ slot: 1, type: { name: 'grass', url: '' } }],
          stats: [],
          abilities: [],
          speciesInfo: {} as never,
          evolutionChain: [],
        },
      }

      const result = getPokemonDisplayData(pokemonList, pokemonDetails)

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe(1)
      expect(result[0].primaryType).toBe('grass')
      expect(result[1].primaryType).toBe('normal')
    })

    it('should use fallback type when no cached data', () => {
      const pokemonList: PokemonListItem[] = [{ id: 3, name: 'venusaur' }]
      const pokemonDetails: Record<number, CombinedPokemonDetail> = {}

      const result = getPokemonDisplayData(pokemonList, pokemonDetails, 'poison')

      expect(result[0].primaryType).toBe('poison')
    })

    it('should use normal as default fallback type', () => {
      const pokemonList: PokemonListItem[] = [{ id: 3, name: 'venusaur' }]
      const pokemonDetails: Record<number, CombinedPokemonDetail> = {}

      const result = getPokemonDisplayData(pokemonList, pokemonDetails)

      expect(result[0].primaryType).toBe('normal')
    })
  })

  describe('transformPokemonToDisplayData', () => {
    it('should transform with cached data', () => {
      const getPokemonDetail = (id: number) => {
        if (id === 1) {
          return {
            id: 1,
            name: 'bulbasaur',
            height: 7,
            weight: 69,
            sprites: {} as never,
            types: [{ slot: 1, type: { name: 'grass', url: '' } }],
            stats: [],
            abilities: [],
            speciesInfo: {} as never,
            evolutionChain: [],
          }
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
