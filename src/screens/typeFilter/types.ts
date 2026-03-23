import { ImageSourcePropType } from 'react-native'
import { GetThemeValueForKey } from 'tamagui'
import { getPokemonTypeStyles } from '@/utils/pokemonThemeUtils'
import type { PokemonDisplayDataArray } from 'src/utils/getPokemonDisplayData'

export interface TypeFilterHeaderProps {
  typeName: string
  typeIcon: ImageSourcePropType | undefined
}

export interface UseTypeFilterDataReturn {
  filteredData: PokemonDisplayDataArray
  loading: boolean
  isLoading: boolean
  error: string | null
  handleSelect: (id: number) => Promise<void>
  loadPokemon: () => Promise<void>
}

export interface UseTypeFilterScreenReturn {
  filteredData: PokemonDisplayDataArray
  loading: boolean
  isLoading: boolean
  error: string | null
  typeName: string
  typeColor: string | GetThemeValueForKey<'backgroundColor'>
  typeIcon: ReturnType<typeof getPokemonTypeStyles>['typeIcon']
  handleSelect: (id: number) => Promise<void>
  onGoBack: () => void
}
