import { ImageSourcePropType } from 'react-native'
import { GetThemeValueForKey } from 'tamagui'
import type { PokemonDisplayDataArray } from 'src/utils/getPokemonDisplayData'
import type { ScreenStatus, PokemonListItem } from '@/types/screen'

type PrimaryTypeColor = string | GetThemeValueForKey<'backgroundColor'>

export interface TypeFilterHeaderProps {
  typeName: string
  typeIcon: ImageSourcePropType | undefined
}

interface TypeFilterDataData {
  filteredData: PokemonDisplayDataArray
  pokemonListForRecent: PokemonListItem[]
}

interface TypeFilterScreenData extends TypeFilterDataData {
  typeName: string
  typeColor: PrimaryTypeColor
  typeIcon: ImageSourcePropType | undefined
}

export interface UseTypeFilterDataReturn {
  data: TypeFilterDataData
  status: ScreenStatus
  actions: {
    handleSelect: (id: number) => Promise<void>
    loadPokemon: () => Promise<void>
  }
}

export interface UseTypeFilterScreenReturn {
  data: TypeFilterScreenData
  status: ScreenStatus
  actions: {
    handleSelect: (id: number) => Promise<void>
    onGoBack: () => void
  }
}
