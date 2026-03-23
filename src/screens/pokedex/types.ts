import type { BookmarkedPokemonProps } from '@/components/pokemon/BookmarkedPokemon/types'
import type { TypeGridItem } from '@/components/pokemon/PokemonTypeGrid/types'
import type { RecentSelectionsProps } from '@/components/pokemon/RecentSelections/types'
import type { CombinedPokemonDetail } from 'src/services/types'
import type { RecentSelection } from 'src/store/pokemonGeneralStore'

export interface PokedexBodyProps {
  pokemonListDataSet: Array<{ id: string; title: string }>
  bookmarkedPokemonIds: BookmarkedPokemonProps['bookmarkedPokemonIds']
  getPokemonDetail: BookmarkedPokemonProps['getPokemonDetail']
  toggleBookmark: BookmarkedPokemonProps['onRemove']
  recentSelections: RecentSelectionsProps['recentSelections']
  removeRecentSelection: RecentSelectionsProps['onRemove']
  onSelect: (id: number) => Promise<void>
  typeList: TypeGridItem[]
  onTypeSelect: (typeId: number, typeName: string) => void
}

export type UsePokedexDataReturn = Pick<PokedexBodyProps, 
  'pokemonListDataSet' | 
  'bookmarkedPokemonIds' | 
  'getPokemonDetail' | 
  'toggleBookmark' | 
  'recentSelections' | 
  'removeRecentSelection' | 
  'typeList'
> & {
  isLoading: boolean
  handleSelect: (id: number) => Promise<void>
}

export type UsePokedexScreenReturn = UsePokedexDataReturn & {
  handleTypeSelect: (typeId: number, typeName: string) => void
}
