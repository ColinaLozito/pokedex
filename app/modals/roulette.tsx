import NumberRoulette from 'app/components/NumberRoulette'
import { useModalStore } from 'app/store/modalStore'
import { DISMISSAL_DELAY, MODAL_STYLES } from 'app/utils/modalConstants'
import { useRouter } from 'expo-router'
import { useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { YStack } from 'tamagui'

export default function RouletteModalScreen() {
  const router = useRouter()
  // Use individual selectors to avoid creating new object on every render
  const modalType = useModalStore((state) => state.type)
  const modalProps = useModalStore((state) => state.props)
  const closeModal = useModalStore((state) => state.closeModal)
  const isDismissingRef = useRef(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Type guard function for better type safety
  const isRouletteProps = (props: unknown): props is {
    sessionKey: number
    finalNumber: number
    duration: number
    min: number
    max: number
    onComplete?: (finalNumber: number) => Promise<void> | void
  } => {
    return (
      props !== null &&
      typeof props === 'object' &&
      'sessionKey' in props &&
      'finalNumber' in props &&
      'duration' in props &&
      'min' in props &&
      'max' in props
    )
  }

  // Type guard to ensure props are for roulette modal
  const rouletteProps = modalType === 'roulette' && isRouletteProps(modalProps)
    ? modalProps
    : null

  // Dismiss modal if type/props are missing on mount (edge case)
  useEffect(() => {
    if ((!modalType || !rouletteProps) && !isDismissingRef.current) {
      isDismissingRef.current = true
      try {
        router.back() // Dismiss the modal
      } catch (error) {
        console.error('Failed to navigate back from roulette modal:', error)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [])

  if (!rouletteProps) {
    return null
  }

  const handleComplete = async (finalNumber: number) => {
    if (isDismissingRef.current) {
      return // Prevent double dismissal
    }
    
    try {
      isDismissingRef.current = true
      await rouletteProps.onComplete?.(finalNumber)
    } catch (error) {
      console.error('Error in roulette onComplete callback:', error)
      // Still dismiss modal even if callback fails
    } finally {
      // Dismiss the modal (goes back to previous screen)
      try {
        router.back()
      } catch (error) {
        console.error('Failed to navigate back from roulette modal:', error)
      }
      // Clear any existing timeout before setting a new one
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      // Clear modal state after a delay to ensure dismissal completes
      timeoutRef.current = setTimeout(() => {
        closeModal()
        isDismissingRef.current = false
        timeoutRef.current = null
      }, DISMISSAL_DELAY)
    }
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
      <YStack width="100%" maxWidth={MODAL_STYLES.maxWidth} minHeight={MODAL_STYLES.minHeight}>
        <NumberRoulette
          key={`roulette-${rouletteProps.sessionKey}`}
          onComplete={handleComplete}
          duration={rouletteProps.duration}
          min={rouletteProps.min}
          max={rouletteProps.max}
          start
          finalNumber={rouletteProps.finalNumber}
        />
      </YStack>
    </SafeAreaView>
  )
}

