# Global Error Boundary

## Overview

A robust top-level Error Boundary to catch unhandled JavaScript errors, preventing the app from showing blank screens or crashing abruptly.

## Implementation

### Location
`src/components/common/GlobalErrorBoundary/`

### Files
- `index.tsx` - Main `GlobalErrorBoundary` component
- `ErrorFallback.tsx` - Custom fallback UI (Pokemon-themed)
- `types.ts` - TypeScript interfaces

### Dependencies
```bash
yarn add react-error-boundary@^5.0.0
```

## Usage

### Basic Integration

The `GlobalErrorBoundary` is already integrated in `app/_layout.tsx`:

```tsx
<TamaguiProvider>
  <GlobalErrorBoundary onReset={() => {}}>
    {children}
  </GlobalErrorBoundary>
</TamaguiProvider>
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `children` | `React.ReactNode` | The main app navigation/layout |
| `onReset` | `() => void` | Callback to clear global state or restart app logic |

## Features

### Error Handling
- Catches all unhandled JavaScript errors in the component tree
- Logs errors + component stack to console
- Sentry integration placeholder ready (uncomment in `index.tsx`)

### Soft Reset
On "Try Again" button press:
1. Clears all Zustand stores (`$reset()`)
2. Redirects to Home via `router.replace('/')`

### Fallback UI
- Pokemon-themed design with baseColors
- Friendly error message: "Oops! Something went wrong"
- Collapsible error details (toggle in UI)
- "Try Again" button to reset

## Zustand Store Reset

Each store has a `$reset()` method:

```ts
// In store files
$reset: () => void

// Usage
usePokemonGeneralStore.getState().$reset()
usePokemonDataStore.getState().$reset()
useModalStore.getState().$reset()
```

## Testing

A test button is temporarily added to `src/screens/home.tsx`:

```tsx
const TestErrorTriggerButton = () => {
  const [shouldError, setShouldError] = useState(false)

  if (shouldError) {
    throw new Error('Test error triggered by user!')
  }

  return (
    <Button onPress={() => setShouldError(true)}>
      Test Error
    </Button>
  )
}
```

**Remove after testing.**

## Future Enhancements

- Integrate Sentry for production error tracking
- Add error boundary for specific routes
- Implement error reporting modal for user feedback
