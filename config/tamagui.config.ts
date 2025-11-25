import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui, createTokens } from 'tamagui'
import { baseColors, pokemonTypeColors } from './colors'
import { montserrat } from './fonts'

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
  settings: {
    ...defaultConfig.settings,
    onlyAllowShorthands:false
  },
})

export default config

export type Conf = typeof config
declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}