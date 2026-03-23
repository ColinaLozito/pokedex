import type { BookmarkedPokemonProps } from '@/screens/pokedex/_parts/BookmarkedPokemon/types'
import type { TypeGridItem } from '@/screens/pokedex/_parts/PokemonTypeGrid/types'
import type { RecentSelectionsProps } from '@/screens/pokedex/_parts/RecentSelections/types'
import type { PokemonListDataSet } from '@/types/screen'
import type { CombinedPokemonDetail } from 'src/services/types'

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

interface PokedexDataData {
  pokemonListDataSet: PokemonListDataSet
  bookmarkedPokemonIds: number[]
  recentSelections: RecentSelectionsProps['recentSelections']
  typeList: TypeGridItem[]
}

type PokedexActions = {
  getPokemonDetail: (id: number) => CombinedPokemonDetail | undefined
  toggleBookmark: (id: number) => void
  removeRecentSelection: (id: number) => void
  handleSelect: (id: number) => Promise<void>
}

export interface UsePokedexDataReturn {
  data: PokedexDataData
  actions: PokedexActions
}

export interface UsePokedexScreenReturn {
  data: PokedexDataData
  actions: PokedexActions & {
    handleTypeSelect: (typeId: number, typeName: string) => void
  }
}
