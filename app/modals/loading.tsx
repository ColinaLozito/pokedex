import { useModalStore, type LoadingModalProps } from 'app/store/modalStore'
import { DISMISSAL_DELAY, MODAL_STYLES } from 'app/utils/modalConstants'
import { useRouter } from 'expo-router'
import { useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { H1, YStack } from 'tamagui'

export default function LoadingModalScreen() {
  const router = useRouter()
  // Use individual selectors to avoid creating new object on every render
  const modalType = useModalStore((state) => state.type)
  const modalProps = useModalStore((state) => state.props)
  const closeModal = useModalStore((state) => state.closeModal)
  const isDismissingRef = useRef(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Type guard function for better type safety
  const isLoadingProps = (props: unknown): props is LoadingModalProps => {
    return props !== null && typeof props === 'object' && 'message' in props
  }

  // Type guard to ensure props are for loading modal
  const loadingProps = modalType === 'loading' && isLoadingProps(modalProps) 
    ? modalProps 
    : null

  // Dismiss modal if type/props are missing
  useEffect(() => {
    if ((!modalType || modalType !== 'loading' || !loadingProps) && !isDismissingRef.current) {
      // Clear any existing timeout before setting a new one
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      
      isDismissingRef.current = true
      try {
        router.back() // Dismiss the modal
      } catch (error) {
        console.error('Failed to navigate back from loading modal:', error)
      }
      // Clear modal state after a delay to ensure dismissal completes
      timeoutRef.current = setTimeout(() => {
        closeModal()
        isDismissingRef.current = false
        timeoutRef.current = null
      }, DISMISSAL_DELAY)
    }
    
    // Cleanup: clear timeout if effect re-runs
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [modalType, loadingProps, router, closeModal])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [])

  if (!loadingProps) {
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
        gap={16}
      >
        <H1 color="white" textAlign="center">{loadingProps.message}</H1>
      </YStack>
    </SafeAreaView>
  )
}

