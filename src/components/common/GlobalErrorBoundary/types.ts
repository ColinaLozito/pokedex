export interface GlobalErrorBoundaryProps {
  children: React.ReactNode
  onReset: () => void
}

export interface ErrorFallbackProps {
  error: unknown
  resetErrorBoundary: (...args: unknown[]) => void
}
