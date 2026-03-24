import type { PokemonListItem, ScreenStatusWithCache } from '@/types/screen'
import { ImageSourcePropType } from 'react-native'
import type { PokemonDisplayDataArray } from 'src/utils/pokemon/displayData'
import { GetThemeValueForKey } from 'tamagui'

type PrimaryTypeColor = string | GetThemeValueForKey<'backgroundColor'>

export interface TypeFilterHeaderProps {
  typeName: string
  typeIcon: ImageSourcePropType | undefined
}

interface TypeFilterDataData {
  filteredData: PokemonDisplayDataArray
  pokemonListForRecent: PokemonListItem[]
  hasMore: boolean
}

interface TypeFilterScreenData extends TypeFilterDataData {
  typeName: string
  typeColor: PrimaryTypeColor
  typeIcon: ImageSourcePropType | undefined
}

export interface UseTypeFilterDataReturn {
  data: TypeFilterDataData
  status: ScreenStatusWithCache
  actions: {
    handleSelect: (id: number) => Promise<void>
    loadPokemon: () => Promise<void>
    loadMore: () => void
  }
}

export interface UseTypeFilterScreenReturn {
  data: TypeFilterScreenData
  status: ScreenStatusWithCache
  actions: {
    handleSelect: (id: number) => Promise<void>
    onGoBack: () => void
    loadMore: () => void
  }
}

export interface PokemonGridProps {
  data: PokemonDisplayDataArray
  onSelect: (id: number) => Promise<void>
  onLoadMore?: () => void
  hasMore?: boolean
}
