import { useModalStore } from '@/store/modalStore'
import { useCallback } from 'react'

export function useModal() {
  const openModal = useModalStore((state) => state.openModal)
  const closeModal = useModalStore((state) => state.closeModal)

  const showLoading = useCallback(
    (message?: string) => {
      openModal('loading', { message })
    },
    [openModal],
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
