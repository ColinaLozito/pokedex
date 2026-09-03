import config from '@theme/tamagui.config'
import { TamaguiProvider } from 'tamagui'

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <TamaguiProvider
      config={config}
      defaultTheme="light"
    >
      {children}
    </TamaguiProvider>
  )
}
