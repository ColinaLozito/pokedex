import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui, createTokens } from 'tamagui'
import { montserrat } from './fonts'
import { baseColors, pokemonTypeColors } from './colors'

const defaultTokens = defaultConfig.tokens

const tokens = createTokens({
  ...defaultTokens,
  color: {
    ...baseColors,
    ...pokemonTypeColors,
  },
})

export const config = createTamagui({
  ...defaultConfig,
  tokens,
  fonts: {
    ...defaultConfig.fonts,
    body: montserrat,
    heading: montserrat,
  },
})

export default config

export type Conf = typeof config
declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}