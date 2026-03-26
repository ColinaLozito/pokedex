import { ErrorBoundary } from 'react-error-boundary'
import { useRouter } from 'expo-router'
import { useUserStore } from '../../../store/userStore'
import { useModalStore } from '../../../store/modalStore'
import ErrorFallback from './ErrorFallback'
import type { GlobalErrorBoundaryProps } from './types'

export default function GlobalErrorBoundary({
  children,
  onReset,
}: GlobalErrorBoundaryProps) {
  const router = useRouter()

  const handleReset = () => {
    useUserStore.getState().$reset()
    useModalStore.getState().$reset()
    onReset?.()
    router.replace('/main')
  }

  return (
    <ErrorBoundary
      onReset={handleReset}
      onError={(error, info) => {
        console.error('GlobalErrorBoundary caught an error:', error)
        console.error('Component stack:', info.componentStack)
      }}
      fallbackRender={(props) => <ErrorFallback {...props} resetErrorBoundary={handleReset} />}
    >
      {children}
    </ErrorBoundary>
  )
}

export { GlobalErrorBoundary }
