import { STAT_ORDER } from '@/shared/api/queries/pokemonQueries'
import type { PokemonStatEntry } from '@/shared/types/pokemon.domain'

export function sortStatsByOrder(stats: PokemonStatEntry[]): PokemonStatEntry[] {
  return STAT_ORDER.map((orderName) => {
    const matchingStat = stats.find((stat) => stat.stat.name === orderName)
    if (matchingStat) {
      return matchingStat
    }
    return {
      base_stat: 0,
      stat: {
        name: orderName,
        url: '',
      },
    }
  })
}
