export interface PokemonColor {
  readonly id: number
  readonly name: string
}

export interface PokemonColorResponse {
  readonly id: number
  readonly name: string
  readonly pokemon: Array<{
    readonly pokemon: {
      readonly name: string
      readonly url: string
    }
    readonly slot: number
  }>
}
