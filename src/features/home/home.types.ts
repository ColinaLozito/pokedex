import type { PokemonListDataSet } from '@/types/screen'
import type { CombinedPokemonDetail, PokemonListItem } from 'src/shared/types/pokemon.domain'
import type { RecentSelection } from 'src/store/types/user'

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

export interface HomeBodyProps {
  pokemonListDataSet: PokemonListDataSet
  bookmarkedPokemonIds: BookmarkedPokemonProps['bookmarkedPokemonIds']
  getPokemonDetail: BookmarkedPokemonProps['getPokemonDetail']
  toggleBookmark: BookmarkedPokemonProps['onRemove']
  recentSelections: RecentSelectionsProps['recentSelections']
  removeRecentSelection: RecentSelectionsProps['onRemove']
  onSelect: (id: number) => Promise<void>
  typeList: TypeGridItem[]
  onTypeSelect: (typeId: number, typeName: string) => void
  onSearchChange?: (searchTerm: string) => void
  searchResults?: { id: string; title: string }[]
  isSearchLoading?: boolean
}

export interface HomeDataData {
  pokemonListDataSet: PokemonListDataSet
  bookmarkedPokemonIds: number[]
  recentSelections: RecentSelection[]
  typeList: TypeGridItem[]
  searchResults: { id: string; title: string }[]
  isSearchLoading: boolean
}

export interface HomeActionsBase {
  getPokemonDetail: (id: number) => CombinedPokemonDetail | undefined
  toggleBookmark: (id: number) => void
  removeRecentSelection: (id: number) => void
  handleSelect: (id: number) => Promise<void>
  onSearchChange: (term: string) => void
}

export interface UseHomeDataReturn {
  data: HomeDataData
  actions: HomeActionsBase
}

export interface UseHomeScreenReturn {
  data: HomeDataData
  actions: HomeActionsBase & {
    handleTypeSelect: (typeId: number, typeName: string) => void
  }
}
