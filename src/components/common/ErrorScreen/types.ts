import { GetThemeValueForKey } from 'tamagui'

export interface ErrorScreenProps {
  error: string
  onGoBack?: () => void
  goBackText?: string
  backgroundColor?: string
  errorColor?: string
  goBackColor?: string
}
