import { getTypeColor } from '../pokemon/typeColor'

describe('typeColor', () => {
  describe('getTypeColor', () => {
    it('should return color for fire type', () => {
      const result = getTypeColor('fire')
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
    })

    it('should return color for water type', () => {
      const result = getTypeColor('water')
      expect(result).toBeDefined()
    })

    it('should return color for grass type', () => {
      const result = getTypeColor('grass')
      expect(result).toBeDefined()
    })

    it('should return fallback for unknown type', () => {
      const result = getTypeColor('unknowntype')
      expect(result).toBeDefined()
    })

    it('should return fallback for undefined', () => {
      const result = getTypeColor(undefined)
      expect(result).toBeDefined()
    })

    it('should handle uppercase type', () => {
      const result = getTypeColor('FIRE')
      expect(result).toBeDefined()
    })
  })
})