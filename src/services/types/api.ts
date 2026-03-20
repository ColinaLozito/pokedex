// Common API primitives for PokéAPI shapes
export interface NamedAPIResource {
  readonly name: string
  readonly url: string
}

export interface PaginatedResponse<T> {
  readonly count: number
  readonly next: string | null
  readonly previous: string | null
  readonly results: Array<T>
}
