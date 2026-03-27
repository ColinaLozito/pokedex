import { usePathname, useRouter } from 'expo-router'
import { useCallback } from 'react'
import { useModalStore } from 'src/store/modalStore'

export function useModal() {
  const router = useRouter()
  const pathname = usePathname()
  const openModal = useModalStore((state) => state.openModal)
  const closeModal = useModalStore((state) => state.closeModal)
  const modalType = useModalStore((state) => state.type)

  const showLoading = useCallback(
    async (message?: string) => {
      if (modalType === 'loading' && pathname === '/modals/loading') {
        openModal('loading', { message })
        return
      }
      
      try {
        openModal('loading', { message })
        await router.push('/modals/loading')
      } catch (error) {
        console.error('Failed to show loading modal:', error)
        closeModal()
      }
    },
    [openModal, router, closeModal, modalType, pathname],
  )

  const dismiss = useCallback(() => {
    closeModal()
  }, [closeModal])

  return {
    showLoading,
    dismiss,
    closeModal,
  }
}
