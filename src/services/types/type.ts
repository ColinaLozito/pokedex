
export interface TypeListItem {
  readonly id: number
  readonly name: string
}

// Raw shape for a specific type (used by /type/{id})
export interface TypeResponse {
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
