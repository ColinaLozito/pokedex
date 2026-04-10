import { useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { H1, YStack } from 'tamagui'
import { MODAL_STYLES } from '../constants'
import { useLoadingModalScreen } from './hooks/useLoadingModalScreen'

export default function LoadingModalScreen() {
  const { data } = useLoadingModalScreen()

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [])

  if (!data.loadingProps) {
    return null
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: MODAL_STYLES.backgroundColor,
        justifyContent: 'center',
         alignItems: 'center',
        padding: MODAL_STYLES.padding,
      }}
    >
      <YStack
        width="100%"
        maxWidth={MODAL_STYLES.maxWidth}
        minHeight={MODAL_STYLES.minHeight}
        justifyContent="center"
         alignItems="center"
        gap="$4"
      >
        <H1 color="$white" textAlign="center">{data.message}</H1>
      </YStack>
    </SafeAreaView>
  )
}
