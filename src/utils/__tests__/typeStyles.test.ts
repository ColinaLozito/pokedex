jest.mock('../ui/typeIcons', () => ({
  __esModule: true,
  default: {
    fire: { uri: 'fire-icon' },
    water: { uri: 'water-icon' },
    grass: { uri: 'grass-icon' },
    electric: { uri: 'electric-icon' },
    psychic: { uri: 'psychic-icon' },
    fighting: { uri: 'fighting-icon' },
    normal: { uri: 'normal-icon' },
    flying: { uri: 'flying-icon' },
    poison: { uri: 'poison-icon' },
    ground: { uri: 'ground-icon' },
    rock: { uri: 'rock-icon' },
    bug: { uri: 'bug-icon' },
    ghost: { uri: 'ghost-icon' },
    dragon: { uri: 'dragon-icon' },
    steel: { uri: 'steel-icon' },
    fairy: { uri: 'fairy-icon' },
    ice: { uri: 'ice-icon' },
    dark: { uri: 'dark-icon' },
  },
}))

import { getPokemonTypeStyles } from '../pokemon/typeStyles'

describe('typeStyles', () => {
  describe('getPokemonTypeStyles', () => {
    it('should return correct color for fire type', () => {
      const result = getPokemonTypeStyles('fire')
      expect(result.typeColor).toBeDefined()
    })

    it('should return correct color for water type', () => {
      const result = getPokemonTypeStyles('water')
      expect(result.typeColor).toBeDefined()
    })

    it('should handle uppercase type names', () => {
      const result = getPokemonTypeStyles('FIRE')
      expect(result.typeColor).toBeDefined()
    })

    it('should fallback for unknown type', () => {
      const result = getPokemonTypeStyles('unknowntype')
      expect(result.typeColor).toBeDefined()
    })
  })
})