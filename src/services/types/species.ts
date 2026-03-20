export interface FlavorTextEntry {
  readonly flavor_text: string
  readonly language: {
    readonly name: string
    readonly url: string
  }
  readonly version: {
    readonly name: string
    readonly url: string
  }
}

export interface GenusEntry {
  readonly genus: string
  readonly language: {
    readonly name: string
    readonly url: string
  }
}

export interface PokemonSpecies {
  readonly id: number
  readonly name: string
  readonly evolution_chain: {
    readonly url: string
  }
  readonly flavor_text_entries: Array<FlavorTextEntry>
  readonly genera: Array<GenusEntry>
  readonly habitat: {
    readonly name: string
    readonly url: string
  } | null
  readonly is_legendary: boolean
  readonly is_mythical: boolean
}
