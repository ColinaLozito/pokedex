import { GetThemeValueForKey } from "tamagui"

// Pokemon stat constants
export const MAX_POKEMON_STAT = 255
export const PERCENT_MULTIPLIER = 100

export const calculateStatBarPercentage = (baseStat: number): GetThemeValueForKey<"width"> => {
  return `${(baseStat / MAX_POKEMON_STAT) * PERCENT_MULTIPLIER}%`
}

export const evolutionSpriteVariantStyleConfig = {
    linear: {
      imageSize: 90,
      padding: '$2',
      nameFontSize: '$1',
      idFontSize: '$2',
      nameMarginTop: '$2',
      idMarginTop: '$1',
      backgroundColor: '$opacity1',
      minWidth: '20%',
      maxWidth: '100%',
    },
    'branching-initial': {
      imageSize: 90,
      padding: '$3',
      nameFontSize: '$2',
      idFontSize: '$3',
      nameMarginTop: '$3',
      idMarginTop: '$1',
      backgroundColor: '$opacity1',
      minWidth: undefined,
      maxWidth: undefined,
    },
    'branching-variant': {
      imageSize: 70,
      padding: '$2',
      nameFontSize: '$2',
      idFontSize: '$2',
      nameMarginTop: '$1',
      idMarginTop: '$1',
      backgroundColor: '$opacity4',
      minWidth: undefined,
      maxWidth: undefined,
    },
  }