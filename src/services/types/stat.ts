export interface Stat {
  readonly id: number
  readonly name: string
  readonly is_battle_only?: boolean
}

export interface StatResponse {
  readonly id: number
  readonly name: string
  readonly base_stat?: number
  readonly game_index?: number
  readonly is_battle_only?: boolean
}
