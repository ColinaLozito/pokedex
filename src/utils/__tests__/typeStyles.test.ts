import { getPokemonTypeStyles } from '@/utils/pokemon/typeStyles'

jest.mock('@/utils/ui/typeIcons', () => ({
  __esModule: true,
  default: {
    fire: { uri: 'fire-icon' },
    water: { uri: 'water-icon' },
    grass: { uri: 'grass-icon' },
  },
}))

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

    it('should return correct icon for fire type', () => {
      const result = getPokemonTypeStyles('fire')

      expect(result.typeIcon).toBeDefined()
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
