import {
  getTodayDateString,
  isNewDay,
  generateRandomPokemonId,
} from '../date/dateUtils'

describe('dateUtils', () => {
  describe('getTodayDateString', () => {
    it('should return date in YYYY-MM-DD format', () => {
      const result = getTodayDateString()
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })
  })

  describe('isNewDay', () => {
    it('should return true for null', () => {
      expect(isNewDay(null)).toBe(true)
    })

    it('should return true for different date', () => {
      expect(isNewDay('2020-01-01')).toBe(true)
    })

    it('should return false for today date', () => {
      const today = getTodayDateString()
      expect(isNewDay(today)).toBe(false)
    })
  })

  describe('generateRandomPokemonId', () => {
    it('should return number between 1 and 1000', () => {
      const id = generateRandomPokemonId()
      expect(id).toBeGreaterThanOrEqual(1)
      expect(id).toBeLessThanOrEqual(1000)
    })

    it('should return different values on multiple calls', () => {
      const ids = new Set(Array.from({ length: 100 }, () => generateRandomPokemonId()))
      expect(ids.size).toBeGreaterThan(1)
    })
  })
})
