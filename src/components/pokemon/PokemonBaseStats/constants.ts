import { GetThemeValueForKey } from "tamagui"

// Pokemon stat constants
export const MAX_POKEMON_STAT = 255
export const PERCENT_MULTIPLIER = 100

export const calculateStatBarPercentage = (baseStat: number): GetThemeValueForKey<"width"> => {
  return `${(baseStat / MAX_POKEMON_STAT) * PERCENT_MULTIPLIER}%`
}