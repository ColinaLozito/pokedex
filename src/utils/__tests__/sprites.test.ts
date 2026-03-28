import { getPokemonSpriteUrl, getPokemonSprite } from '@/utils/pokemon/sprites'

describe('sprites', () => {
  describe('getPokemonSpriteUrl', () => {
    it('should return correct URL for given ID', () => {
      expect(getPokemonSpriteUrl(25)).toBe(
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
      )
    })

    it('should return correct URL for ID 1', () => {
      expect(getPokemonSpriteUrl(1)).toBe(
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'
      )
    })
  })

  describe('getPokemonSprite', () => {
    it('should return sprite from official-artwork', () => {
      const pokemonData = {
        sprites: {
          other: {
            'official-artwork': {
              front_default: 'https://example.com/official.png',
            },
          },
        },
      } as never

      expect(getPokemonSprite(pokemonData, 25)).toBe('https://example.com/official.png')
    })

    it('should fallback to home sprite if official not available', () => {
      const pokemonData = {
        sprites: {
          other: {
            home: {
              front_default: 'https://example.com/home.png',
            },
          },
        },
      } as never

      expect(getPokemonSprite(pokemonData, 25)).toBe('https://example.com/home.png')
    })

    it('should fallback to front_default if other not available', () => {
      const pokemonData = {
        sprites: {
          front_default: 'https://example.com/default.png',
        },
      } as never

      expect(getPokemonSprite(pokemonData, 25)).toBe('https://example.com/default.png')
    })

    it('should fallback to ID-based URL if no sprites available', () => {
      const pokemonData = {
        sprites: {},
      } as never

      expect(getPokemonSprite(pokemonData, 25)).toBe(getPokemonSpriteUrl(25))
    })

    it('should return ID-based URL if pokemonData is undefined', () => {
      expect(getPokemonSprite(undefined, 25)).toBe(getPokemonSpriteUrl(25))
    })
  })
})
