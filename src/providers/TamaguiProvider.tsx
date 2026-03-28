import { ToastProvider, ToastViewport } from '@tamagui/toast'
import { config } from '@theme/tamagui.config'
import { useColorScheme } from 'react-native'
import { TamaguiProvider, type TamaguiProviderProps } from 'tamagui'
import { CurrentToast } from '@/shared/components/ui/atomic/Toast'

export function Provider({ children, ...rest }: Omit<TamaguiProviderProps, 'config'>) {
  const colorScheme = useColorScheme()

  return (
    <TamaguiProvider
      config={config}
      defaultTheme={colorScheme === 'dark' ? 'dark' : 'light'}
      {...rest}
    >
      <ToastProvider
        swipeDirection="horizontal"
        duration={3000}
      >
        {children}
        <CurrentToast />
        <ToastViewport top="$6" left="$0" right="$0" />
      </ToastProvider>
    </TamaguiProvider>
  )
}
