export type GameStatus = 'playing' | 'correct' | 'incorrect'

export interface WhosThatPokemonReturn {
  pokemonId: number
  spriteUrl: string
  options: string[]
  correctName: string
  status: GameStatus
  selectedOption: string | null
  isLoading: boolean
  error: string | null
  handleSelect: (name: string) => void
  handleNext: () => void
  retry: () => void
}

export interface RoundState {
  ids: number[]
  correctIndex: number
  status: GameStatus
  selectedOption: string | null
}
