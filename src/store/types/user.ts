export interface RecentSelection {
  id: number
  name: string
  selectedAt: number
}

export interface UserState {
  bookmarkedPokemonIds: number[]
  recentSelections: RecentSelection[]
  toggleBookmark: (id: number) => void
  addRecentSelection: (pokemon: { id: number; name: string }) => void
  removeRecentSelection: (pokemonId: number) => void
  $reset: () => void
}
