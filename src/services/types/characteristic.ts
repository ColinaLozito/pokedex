export interface CharacteristicDescription {
  readonly description: string
  readonly language: {
    readonly name: string
    readonly url: string
  }
}

export interface Characteristic {
  readonly id: number
  readonly name: string
  readonly descriptions: Array<CharacteristicDescription>
}
