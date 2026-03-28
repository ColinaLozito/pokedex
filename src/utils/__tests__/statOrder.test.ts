import type { PokemonStatEntry } from '@/shared/types/pokemon.domain'
import { sortStatsByOrder } from '@/utils/pokemon/statOrder'

describe('statOrder', () => {
  describe('sortStatsByOrder', () => {
    it('should sort stats in correct order', () => {
      const stats: PokemonStatEntry[] = [
        { base_stat: 50, stat: { name: 'speed', url: '' } },
        { base_stat: 80, stat: { name: 'attack', url: '' } },
        { base_stat: 100, stat: { name: 'hp', url: '' } },
        { base_stat: 70, stat: { name: 'defense', url: '' } },
      ]

      const result = sortStatsByOrder(stats)

      expect(result[0].stat.name).toBe('hp')
      expect(result[1].stat.name).toBe('attack')
      expect(result[2].stat.name).toBe('defense')
      expect(result[3].stat.name).toBe('special-attack')
    })

    it('should include all stat names in order', () => {
      const stats: PokemonStatEntry[] = []

      const result = sortStatsByOrder(stats)

      expect(result.length).toBeGreaterThan(0)
      expect(result[0].stat.name).toBe('hp')
      expect(result[result.length - 1].stat.name).toBe('speed')
    })

    it('should use base_stat 0 for missing stats', () => {
      const stats: PokemonStatEntry[] = [
        { base_stat: 50, stat: { name: 'hp', url: '' } },
      ]

      const result = sortStatsByOrder(stats)

      const attackStat = result.find(r => r.stat.name === 'attack')
      expect(attackStat?.base_stat).toBe(0)
    })
  })
})
