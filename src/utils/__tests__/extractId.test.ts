import { extractPokemonId, extractTypeId } from '@/utils/api/extractId'

describe('extractId', () => {
  describe('extractPokemonId', () => {
    it('should extract ID from pokemon URL', () => {
      expect(extractPokemonId('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25)
    })

    it('should extract ID from pokemon-species URL', () => {
      expect(extractPokemonId('https://pokeapi.co/api/v2/pokemon-species/25/')).toBe(25)
    })

    it('should extract ID from URL without trailing slash', () => {
      expect(extractPokemonId('https://pokeapi.co/api/v2/pokemon/150')).toBe(150)
    })

    it('should return 0 for invalid URL', () => {
      expect(extractPokemonId('https://pokeapi.co/api/v2/')).toBe(0)
    })

    it('should return 0 for empty string', () => {
      expect(extractPokemonId('')).toBe(0)
    })
  })

  describe('extractTypeId', () => {
    it('should extract ID from type URL', () => {
      expect(extractTypeId('https://pokeapi.co/api/v2/type/1/')).toBe(1)
    })

    it('should extract ID from type URL with double digits', () => {
      expect(extractTypeId('https://pokeapi.co/api/v2/type/12/')).toBe(12)
    })

    it('should return 0 for invalid URL', () => {
      expect(extractTypeId('https://pokeapi.co/api/v2/type/')).toBe(0)
    })

    it('should return 0 for empty string', () => {
      expect(extractTypeId('')).toBe(0)
    })
  })
})
