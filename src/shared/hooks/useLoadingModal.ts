import { useEffect, useRef } from 'react'
import { useModal } from './useModal'

export function useLoadingModal(
  isLoading: boolean | (() => boolean),
  message?: string,
  dependencies: unknown[] = [],
) {
  const { showLoading, dismiss } = useModal()
  const cancelledRef = useRef(false)

  useEffect(() => {
    cancelledRef.current = false
    const shouldShow = typeof isLoading === 'function' ? isLoading() : isLoading

    if (shouldShow) {
      showLoading(message).catch((error) => {
        if (!cancelledRef.current) {
          console.error('Failed to show loading modal:', error)
        }
      })
    } else {
      dismiss()
    }

    return () => {
      cancelledRef.current = true
      dismiss()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, message, showLoading, dismiss, ...dependencies])
}
