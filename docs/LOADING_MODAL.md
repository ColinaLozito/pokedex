# Loading Modal

A global loading modal overlay powered by Zustand. Renders as an absolute-positioned overlay on top of the navigation stack.

## Two Ways to Use

### 1. Triggered from a Method/Function

Use the `useModal` hook when you need to show a loading state during an async operation (e.g., fetching data on user interaction).

```tsx
import { useModal } from '@/shared/hooks/useModal'

function MyComponent() {
  const { showLoading, dismiss } = useModal()

  const handlePress = async () => {
    // Show loading modal
    showLoading('Loading data...')

    try {
      await fetchData()
    } finally {
      // Dismiss modal before navigating
      dismiss()
    }

    // Navigate to next screen
    router.push('/next')
  }

  return <Button onPress={handlePress}>Load Data</Button>
}
```

**Flow:**
1. Call `showLoading('message')` - modal appears immediately
2. Perform async operation
3. Call `dismiss()` - modal disappears
4. Navigate or continue

---

### 2. Directly After Screen Renders

Use the modal store directly when you need to show loading immediately upon component mount (e.g., initial data fetch).

```tsx
import { useEffect } from 'react'
import { useModalStore } from '@/store/modalStore'

function MyScreen() {
  const openModal = useModalStore((state) => state.openModal)
  const closeModal = useModalStore((state) => state.closeModal)

  useEffect(() => {
    openModal('loading', { message: 'Fetching Pokemon...' })

    fetchData()
      .finally(() => closeModal())
  }, [])

  return <View>...</View>
}
```

**Note:** Don't forget to call `closeModal()` when done to hide the overlay.

---

## API

### useModal hook

| Method | Description |
|--------|-------------|
| `showLoading(message?)` | Opens the loading modal with optional message |
| `dismiss()` | Closes the loading modal |
| `closeModal()` | Alias for dismiss (also clears store) |

### useModalStore

| Method | Description |
|--------|-------------|
| `openModal('loading', { message })` | Opens modal with props |
| `closeModal()` | Closes any open modal |
| `type` | Current modal type (`'loading'` or `null`) |
| `props` | Current modal props |

---

## How It Works

1. `app/_layout.tsx` subscribes to `useModalStore` state
2. When `type === 'loading'`, renders `<LoadingModalScreen />` as an absolute overlay
3. The overlay uses `zIndex: 9999` to appear above all navigation
4. No navigation required - state-driven rendering
