export interface ScreenStatus {
  loading: boolean
  isLoading: boolean
  error: string | null
}

export interface ScreenStatusWithCache extends ScreenStatus {
  isCached: boolean
  hasMore?: boolean
}

export type PokemonListItem = { id: number; name: string }

export type PokemonListDataSet = Array<{ id: string; title: string }>
