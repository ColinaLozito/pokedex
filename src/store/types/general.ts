import type { PokemonListItem, TypeListItem } from 'src/services/types'
import type { PokemonDisplayDataArray } from 'src/utils/getPokemonDisplayData'
import type { PokemonType } from '@theme/pokemonTypes'

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
  pokemonByType: Record<PokemonType, PokemonListItem[]>

  fetchPokemonListAction: () => Promise<void>
  setTypeList: (list: TypeListItem[]) => void
  addRecentSelection: (pokemon: PokemonListItem) => void
  removeRecentSelection: (pokemonId: number) => void
  toggleBookmark: (id: number) => void
  clearTypeCache: (typeName?: PokemonType) => void
  isTypeCached: (typeName: PokemonType) => boolean

  getPokemonDisplayData: (
    pokemonList: PokemonListItem[],
    fallbackType?: string
  ) => PokemonDisplayDataArray
  fetchPokemonByTypeAndGetDisplayData: (
    typeId: number,
    typeName: PokemonType
  ) => Promise<PokemonDisplayDataArray>

  $reset: () => void
}
