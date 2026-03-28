import { GetThemeValueForKey } from "tamagui"

export type PokemonTypeSlot = {
  slot: number
  type: { name: string }
}

export interface TypeChipsProps {
  types: Array<PokemonTypeSlot>
  size?: 'small' | 'medium' | 'large'
  gap?: GetThemeValueForKey<'gap'>
}
