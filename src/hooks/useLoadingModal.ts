import { useEffect, useMemo, useRef } from 'react'
import { useModal } from './useModal'

export function useLoadingModal(
  isLoading: boolean | (() => boolean),
  message?: string,
  dependencies: unknown[] = [],
) {
  const { showLoading, dismiss } = useModal()
  const cancelledRef = useRef(false)

  const isLoadingDependency = typeof isLoading === 'function' ? undefined : isLoading

  const stableDependencies = useMemo(() => {
    return [isLoadingDependency, message, ...dependencies]
  }, [dependencies, isLoadingDependency, message])

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
  }, stableDependencies)
}
