import type { GetThemeValueForKey } from 'tamagui'

export interface EmptyStateProps {
  title: string
  subtitle?: string
  backgroundColor?: string
  titleColor?: GetThemeValueForKey<"color"> 
  subtitleColor?: GetThemeValueForKey<"color"> 
}
