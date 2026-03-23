import { DISMISSAL_DELAY, MODAL_STYLES } from '@/utils/modalConstants'
import { useRouter } from 'expo-router'
import { useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { H1, YStack } from 'tamagui'
import { useLoadingModalScreen } from './hooks/useLoadingModalScreen'

export default function LoadingModalScreen() {
  const router = useRouter()
  const { data, actions } = useLoadingModalScreen()

  const isDismissingRef = useRef(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!data.loadingProps && !isDismissingRef.current) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      isDismissingRef.current = true
      try {
        router.back()
      } catch {
        // Modal may not be in stack
      }

      timeoutRef.current = setTimeout(() => {
        actions.closeModal()
        isDismissingRef.current = false
        timeoutRef.current = null
      }, DISMISSAL_DELAY)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.loadingProps, router, actions.closeModal])

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
