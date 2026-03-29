import config from '@theme/tamagui.config'
import { useColorScheme } from 'react-native'
import { TamaguiProvider } from 'tamagui'

export function Provider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme()

  return (
    <TamaguiProvider
      config={config}
      defaultTheme={colorScheme === 'dark' ? 'dark' : 'light'}
    >
      {children}
    </TamaguiProvider>
  )
}
