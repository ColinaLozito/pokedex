import { useModalStore, type RouletteModalProps } from 'app/store/modalStore'
import { usePathname, useRouter } from 'expo-router'
import { useCallback } from 'react'

/**
 * Custom hook for managing modals with navigation
 * Provides a cleaner API for opening/closing modals
 */
export function useModal() {
  const router = useRouter()
  const pathname = usePathname()
  const openModal = useModalStore((state) => state.openModal)
  const closeModal = useModalStore((state) => state.closeModal)
  const modalType = useModalStore((state) => state.type)

  const showLoading = useCallback(
    async (message?: string) => {
      // If already showing loading modal, just update the message
      if (modalType === 'loading' && pathname === '/modals/loading') {
        openModal('loading', { message })
        return
      }
      
      try {
        openModal('loading', { message })
        await router.push('/modals/loading')
      } catch (error) {
        console.error('Failed to show loading modal:', error)
        closeModal() // Clean up on failure
      }
    },
    [openModal, router, closeModal, modalType, pathname],
  )

  const showRoulette = useCallback(
    async (props: RouletteModalProps) => {
      // If already showing roulette modal, just update the props
      if (modalType === 'roulette' && pathname === '/modals/roulette') {
        openModal('roulette', props)
        return
      }
      
      try {
        openModal('roulette', props)
        await router.push('/modals/roulette')
      } catch (error) {
        console.error('Failed to show roulette modal:', error)
        closeModal() // Clean up on failure
      }
    },
    [openModal, router, closeModal, modalType, pathname],
  )

  const dismiss = useCallback(() => {
    closeModal()
    // Note: router.back() should be handled by the modal screen itself
  }, [closeModal])

  return {
    showLoading,
    showRoulette,
    dismiss,
    closeModal,
  }
}

