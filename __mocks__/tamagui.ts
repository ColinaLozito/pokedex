import type { ReactNode } from 'react'

type FontConfig = Record<string, unknown>
type TokensConfig = Record<string, unknown>
type TamaguiConfig = Record<string, unknown>

export const createFont = (font: FontConfig): FontConfig => font
export const createTokens = (tokens: TokensConfig): TokensConfig => tokens
export const createTamagui = (config: TamaguiConfig): TamaguiConfig => config
export const YStack = ({ children }: { children?: ReactNode }) => children
export const XStack = ({ children }: { children?: ReactNode }) => children
export const ZStack = ({ children }: { children?: ReactNode }) => children
export const Text = ({ children }: { children?: ReactNode }) => children
export const Card = ({ children }: { children?: ReactNode }) => children
export const CardHeader = ({ children }: { children?: ReactNode }) => children
export const CardFooter = ({ children }: { children?: ReactNode }) => children
export const Button = ({ children }: { children?: ReactNode }) => children
export const Image = () => null
export const H1 = ({ children }: { children?: ReactNode }) => children
export const H2 = ({ children }: { children?: ReactNode }) => children
export const H3 = ({ children }: { children?: ReactNode }) => children
export const H4 = ({ children }: { children?: ReactNode }) => children
export const Spacer = () => null
export const Input = () => null
export const ScrollView = ({ children }: { children?: ReactNode }) => children
export const Pressable = ({ children }: { children?: ReactNode }) => children
export const TamaguiProvider = ({ children }: { children: ReactNode }) => children
export const useTheme = () => ({ background: { val: '#fff' }, text: { val: '#000' } })