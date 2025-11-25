import { useEffect, useMemo, useRef } from 'react'
import { useModal } from './useModal'

/**
 * Hook to automatically show/hide loading modal based on a loading state
 * 
 * @param isLoading - Boolean or function that determines if loading should be shown
 * @param message - Optional message to display in the loading modal
 * @param dependencies - Additional dependencies to watch (for conditional loading)
 * 
 * @example
 * // Simple usage
 * useLoadingModal(loading, 'Loading Pokémon...')
 * 
 * @example
 * // Conditional loading
 * useLoadingModal(loading && selectedPokemonId, 'Loading Pokemon...', [selectedPokemonId])
 * 
 * @example
 * // With function condition
 * useLoadingModal(() => loading && !error, 'Loading...', [loading, error])
 */
export function useLoadingModal(
  isLoading: boolean | (() => boolean),
  message?: string,
  dependencies: unknown[] = [],
) {
  const { showLoading, dismiss } = useModal()
  const cancelledRef = useRef(false)

  // Extract complex expression to variable for dependency array
  const isLoadingDependency = typeof isLoading === 'function' ? undefined : isLoading

  // Create stable dependencies array using useMemo
  const stableDependencies = useMemo(() => {
    return [isLoadingDependency, message, ...dependencies]
  }, [dependencies, isLoadingDependency, message]) // Still has spread, but in useMemo

  useEffect(() => {
    cancelledRef.current = false
    const shouldShow = typeof isLoading === 'function' ? isLoading() : isLoading

    if (shouldShow) {
      // Handle async showLoading properly to prevent race conditions
      showLoading(message).catch((error) => {
        // Only log if not cancelled (component still mounted)
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
    // showLoading and dismiss are stable (memoized), so we don't need them in deps
    // Spread element is necessary to allow dynamic dependencies for conditional loading
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, stableDependencies) // Now it's a single variable
}

