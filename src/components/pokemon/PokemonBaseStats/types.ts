import { GetThemeValueForKey } from 'tamagui'

export interface StatInfo {
  base_stat: number
  stat: {
    name: string
    url: string
  }
}

export interface PokemonBaseStatsProps {
  stats: StatInfo[]
  primaryTypeColor: string | GetThemeValueForKey<'backgroundColor'>
}
