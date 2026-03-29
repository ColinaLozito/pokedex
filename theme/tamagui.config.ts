import { createAnimations } from '@tamagui/animations-react-native';
import { defaultConfig } from '@tamagui/config/v4';
import { shorthands } from '@tamagui/shorthands';
import { createTamagui, createTokens } from 'tamagui';
import { baseColors, pokemonTypeColors } from './colors';
import { montserrat } from './fonts';
import { radius } from './radius';
import { size } from './space';

const tokens = createTokens({
  ...defaultConfig.tokens,
  color: {
    ...baseColors,
    ...pokemonTypeColors,
  },
  size: size,
  radius: radius,
})

const themes = {
  ...defaultConfig.themes,
}

const animations = createAnimations({
  fast: { type: 'spring', stiffness: 250, damping: 20 },
  medium: { type: 'spring', stiffness: 180, damping: 22 },
  slow: { type: 'spring', stiffness: 120, damping: 24 },
})

const appConfig = createTamagui({
  ...defaultConfig,
  tokens,
  themes,
  fonts: {
    body: montserrat,
    heading: montserrat,
  },
  animations,
  settings: {
    ...defaultConfig.settings,
    onlyAllowShorthands: false,
  },
  shorthands
})

export const config = appConfig 
export type AppConfig = typeof appConfig
export default appConfig
declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}