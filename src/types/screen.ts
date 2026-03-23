export interface ScreenStatus {
  loading: boolean
  isLoading: boolean
  error: string | null
}

export type PokemonListItem = { id: number; name: string }

export type PokemonListDataSet = Array<{ id: string; title: string }>
