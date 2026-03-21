import type { CombinedPokemonDetail } from 'src/services/types'

export interface BookmarkedPokemonProps {
   bookmarkedPokemonIds: number[]
   getPokemonDetail: (id: number) => CombinedPokemonDetail | undefined
   onRemove: (id: number) => void
   onSelect?: (id: number) => void
 }