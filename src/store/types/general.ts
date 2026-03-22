import type { PokemonListItem, TypeListItem } from 'src/services/types'
import type { PokemonDisplayDataArray } from 'src/utils/getPokemonDisplayData'

export interface RecentSelection {
  readonly id: number
  readonly name: string
  readonly selectedAt: number
}

export interface PokemonGeneralState {
  pokemonList: PokemonListItem[]
  typeList: TypeListItem[]
  recentSelections: RecentSelection[]
  bookmarkedPokemonIds: number[]

  fetchPokemonListAction: () => Promise<void>
  setTypeList: (list: TypeListItem[]) => void
  addRecentSelection: (pokemon: PokemonListItem) => void
  removeRecentSelection: (pokemonId: number) => void
  toggleBookmark: (id: number) => void

  getPokemonDisplayData: (
    pokemonList: PokemonListItem[],
    fallbackType?: string
  ) => PokemonDisplayDataArray
  fetchPokemonByTypeAndGetDisplayData: (
    typeId: number,
    typeName: string
  ) => Promise<PokemonDisplayDataArray>
}
