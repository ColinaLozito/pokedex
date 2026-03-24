import type { PokemonListDataSet } from '@/types/screen'
import type { CombinedPokemonDetail } from 'src/services/types/pokemon'
import type { RecentSelection } from 'src/store/pokemonGeneralStore'

export interface TypeGridItem {
  id: number
  name: string
}

export interface TypeGridProps {
  typeList: TypeGridItem[]
  onTypeSelect?: (typeId: number, typeName: string) => void
}

export interface TypeCardProps {
  type: TypeGridItem
  onPress: (typeId: number, typeName: string) => void
}

interface PokemonListActionsBase {
  getPokemonDetail: (id: number) => CombinedPokemonDetail | undefined
  onRemove: (id: number) => void
  onSelect?: (id: number) => void
}

export interface BookmarkedPokemonProps extends PokemonListActionsBase {
  bookmarkedPokemonIds: number[]
}

export interface RecentSelectionsProps extends PokemonListActionsBase {
  recentSelections: RecentSelection[]
}

export interface PokedexBodyProps {
  pokemonListDataSet: PokemonListDataSet
  bookmarkedPokemonIds: BookmarkedPokemonProps['bookmarkedPokemonIds']
  getPokemonDetail: BookmarkedPokemonProps['getPokemonDetail']
  toggleBookmark: BookmarkedPokemonProps['onRemove']
  recentSelections: RecentSelectionsProps['recentSelections']
  removeRecentSelection: RecentSelectionsProps['onRemove']
  onSelect: (id: number) => Promise<void>
  typeList: TypeGridItem[]
  onTypeSelect: (typeId: number, typeName: string) => void
}

export interface PokedexDataData {
  pokemonListDataSet: PokemonListDataSet
  bookmarkedPokemonIds: number[]
  recentSelections: RecentSelection[]
  typeList: TypeGridItem[]
}

export interface PokedexActionsBase {
  getPokemonDetail: (id: number) => CombinedPokemonDetail | undefined
  toggleBookmark: (id: number) => void
  removeRecentSelection: (id: number) => void
  handleSelect: (id: number) => Promise<void>
}

export interface UsePokedexDataReturn {
  data: PokedexDataData
  actions: PokedexActionsBase
}

export interface UsePokedexScreenReturn {
  data: PokedexDataData
  actions: PokedexActionsBase & {
    handleTypeSelect: (typeId: number, typeName: string) => void
  }
}
