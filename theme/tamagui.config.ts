import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui, createTokens } from 'tamagui'
import { baseColors, pokemonTypeColors } from './colors'
import { montserrat } from './fonts'
import { radius } from './radius'
import { size } from './space'

const tokens = createTokens({
  ...defaultConfig.tokens,
  color: {
    ...baseColors,
    ...pokemonTypeColors,
  },
  size: size,
  radius: radius,
})

export const config = createTamagui({
  ...defaultConfig,
  tokens,
  fonts: {
    body: montserrat,
    heading: montserrat,
  },
  settings: {
    ...defaultConfig.settings,
    onlyAllowShorthands: false,
  },
})

export default config

export type Conf = typeof config
declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}