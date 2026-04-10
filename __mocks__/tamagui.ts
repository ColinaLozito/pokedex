import React from 'react'

export const createFont = (font: any) => font
export const createTokens = (tokens: any) => tokens
export const createTamagui = (config: any) => config
export const YStack = ({ children }: { children?: React.ReactNode }) => children
export const XStack = ({ children }: { children?: React.ReactNode }) => children
export const ZStack = ({ children }: { children?: React.ReactNode }) => children
export const Text = ({ children }: { children?: React.ReactNode }) => children
export const Card = ({ children }: { children?: React.ReactNode }) => children
export const CardHeader = ({ children }: { children?: React.ReactNode }) => children
export const CardFooter = ({ children }: { children?: React.ReactNode }) => children
export const Button = ({ children }: { children?: React.ReactNode }) => children
export const Image = () => null
export const H1 = ({ children }: { children?: React.ReactNode }) => children
export const H2 = ({ children }: { children?: React.ReactNode }) => children
export const H3 = ({ children }: { children?: React.ReactNode }) => children
export const H4 = ({ children }: { children?: React.ReactNode }) => children
export const Spacer = () => null
export const Input = () => null
export const ScrollView = ({ children }: { children?: React.ReactNode }) => children
export const Pressable = ({ children }: { children?: React.ReactNode }) => children
export const TamaguiProvider = ({ children }: { children: React.ReactNode }) => children
export const useTheme = () => ({ background: { val: '#fff' }, text: { val: '#000' } })