import type { BookmarkedPokemonProps } from '@/components/pokemon/BookmarkedPokemon/types'
import type { TypeGridItem } from '@/components/pokemon/PokemonTypeGrid/types'
import type { RecentSelectionsProps } from '@/components/pokemon/RecentSelections/types'

export interface PokedexBodyProps {
  pokemonListDataSet: Array<{ id: string; title: string }>
  bookmarkedPokemonIds: BookmarkedPokemonProps['bookmarkedPokemonIds']
  getPokemonDetail: BookmarkedPokemonProps['getPokemonDetail']
  toggleBookmark: BookmarkedPokemonProps['onRemove']
  recentSelections: RecentSelectionsProps['recentSelections']
  removeRecentSelection: RecentSelectionsProps['onRemove']
  onSelect: (id: number) => void
  typeList: TypeGridItem[]
  onTypeSelect: (typeId: number, typeName: string) => void
}
