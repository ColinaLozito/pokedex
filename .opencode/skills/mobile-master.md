# 📱 Mobile Master Skill (Expo + RN)

## 🏗 Architecture & Navigation (From RN-Expert)
- Use **Expo Router** for file-based routing.
- Keep business logic in `/app/services` and UI in `/app/components`.
- Handle platform-specific logic (iOS/Android) using the `.ios.tsx` or `.android.tsx` extensions.

## 🚀 Performance & Rendering (From Vercel Skills)
- Use **FlashList** or **LegendList** for the Pokemon list to ensure 60fps.
- Optimize images using `expo-image` with priority caching.
- Use `useMemo` and `useCallback` strictly on list items to avoid over-rendering.

## 🎨 UI & Animations
- Use **Tamagui** tokens for all styling (no hardcoded values).
- Leverage **Reanimated 3** for fluid transitions between the list and the Pokemon detail view.

---

## 🧱 Screen Orchestration Pattern

Every screen must follow this strict separation of concerns:

```
index.tsx (View)
    ↓
useScreenNameScreen (Layer 2: Orchestrator)
    ↓
useScreenNameData (Layer 1: Data)
    ↓
Store Selectors
```

### Layer 1: Data Hook (`useScreenNameData.ts`)
- Pure Zustand selectors
- No theme logic
- No navigation handlers
- Returns: `{ data, status, actions }`

### Layer 2: Screen Hook (`useScreenNameScreen.ts`)
- Composes Data Hook
- Applies theme utils
- Handles navigation
- Returns: `{ data, status, actions }`

### Thin View (`index.tsx`)
- Only useRef, useLoadingModal, lifecycle useEffects
- No business logic

---

## 📦 Return Object Structure

All hooks must return a consistent structured object:

```typescript
interface ScreenReturn {
  data: {
    // Screen-specific data (filtered lists, entities, etc.)
  }
  status: {
    loading: boolean
    isLoading?: boolean  // For selection loading state
    error: string | null
  }
  actions: {
    // Event handlers (onSelect, onGoBack, etc.)
    // Store actions (toggleBookmark, etc.)
  }
}
```

### Rules:
1. **Never return flat objects** - always structure as `{ data, status, actions }`
2. **Memoize all return objects** - use `useMemo` for each group
3. **Handlers go in `actions`** - navigation and event handlers
4. **Theme goes in `data`** - type colors, icons, etc.

---

## 🗄️ Store Subscription Pattern

### Single Subscription Per Store
```typescript
// ❌ BAD: Multiple subscriptions from same store
const loading = useStore(s => s.loading)
const error = useStore(s => s.error)
const items = useStore(s => s.items)

// ✅ GOOD: Single useShallow subscription
const { loading, error, items } = useStore(
  useShallow(s => ({
    loading: s.loading,
    error: s.error,
    items: s.items,
  }))
)
```

### useShallow Import
```typescript
import { useShallow } from 'zustand/react/shallow'
```

### Why useShallow?
- Prevents unnecessary re-renders when object reference changes but values are same
- Groups related state into single subscription
- Reduces selector overhead

---

## ⚡ Memoization Rules

### 1. All Return Objects Must Be Memoized
```typescript
// ❌ BAD: New object reference every render
return { data: { items }, status: { loading } }

// ✅ GOOD: Memoized objects
const dataMemo = useMemo(() => ({ items }), [items])
const statusMemo = useMemo(() => ({ loading }), [loading])

return { data: dataMemo, status: statusMemo }
```

### 2. Derived Data Must Be Memoized
```typescript
// ❌ BAD: Computed on every render
const itemCount = data.items.length

// ✅ GOOD: Memoized derivation
const itemCount = useMemo(
  () => data.items.length,
  [data.items]
)
```

### 3. Event Handlers Must Use useCallback
```typescript
// ❌ BAD: New function every render
const handlePress = (id) => { ... }

// ✅ GOOD: Stable function reference
const handlePress = useCallback(
  (id) => { ... },
  [/* deps */]
)
```

### 4. Remove useEffect State Sync Anti-pattern
```typescript
// ❌ BAD: Manual sync between store and state
useEffect(() => {
  if (storeData.length === 0) return
  setLocalData(getDerivedData(storeData))
}, [storeData])

// ✅ GOOD: Direct memoization from store
const localData = useMemo(
  () => getDerivedData(storeData),
  [storeData]
)
```

---

## 📁 Type Organization

### Screen-Level Types (`screens/*/types.ts`)

```typescript
// 1. Component Props
export interface ComponentProps { ... }

// 2. Data Hook Return Type
interface DataData { ... }
interface DataStatus { ... }
interface DataActions { ... }
export interface UseDataReturn {
  data: DataData
  status: DataStatus
  actions: DataActions
}

// 3. Screen Hook Return Type
interface ScreenData extends DataData { /* additional */ }
interface ScreenStatus { ... }
interface ScreenActions extends DataActions { /* additional */ }
export interface UseScreenReturn {
  data: ScreenData
  status: ScreenStatus
  actions: ScreenActions
}
```

### Shared Types (`src/types/screen.ts`)

Create reusable types for common patterns:

```typescript
export interface ScreenStatus {
  loading: boolean
  isLoading?: boolean
  error: string | null
}

export type PokemonListItem = { id: number; name: string }
export type PokemonListDataSet = Array<{ id: string; title: string }>
```

### Use Pick/Omit for Type Reuse

```typescript
// Reuse ScreenStatus with Pick
type DetailsStatus = Pick<ScreenStatus, 'loading' | 'error'>  // No isLoading

// Reuse with Omit
type CustomStatus = Omit<ScreenStatus, 'isLoading'>
```

---

## 🔧 Shared Utilities

### Theme Utils (`src/utils/pokemonThemeUtils.ts`)

Theme logic should NEVER be in hooks. Use shared utilities:

```typescript
import { pokemonTypeColors } from '@theme/colors'
import typeSymbolsIcons from 'src/utils/typeSymbolsIcons'

interface PokemonTypeStyles {
  typeColor: string
  typeIcon: ImageSourcePropType | undefined
}

export function getPokemonTypeStyles(typeName: string): PokemonTypeStyles {
  const normalized = typeName.toLowerCase()
  return {
    typeColor: pokemonTypeColors[normalized] || '$hillary',
    typeIcon: typeSymbolsIcons[normalized],
  }
}
```

---

## ❌ Anti-Patterns to Avoid

1. **God Hooks** - Single hooks with mixed concerns (data + theme + navigation)
2. **Flat Returns** - Returning `{ prop1, prop2, prop3 }` instead of `{ data, status, actions }`
3. **Multiple Store Subscriptions** - Separate `useStore(s => s.x)` calls for same store
4. **Unmemoized Return Objects** - Creating new object references on every render
5. **useEffect State Sync** - Using useEffect to sync store data to local state
6. **Inline Theme Logic** - Computing colors/icons inside hooks instead of utilities
7. **Inline Interfaces** - Defining types inside hook files instead of `types.ts`

---

## ✅ Checklist Before Committing

- [ ] Hook returns `{ data, status, actions }`
- [ ] All return objects wrapped in `useMemo`
- [ ] Event handlers wrapped in `useCallback`
- [ ] Single `useShallow` subscription per store
- [ ] No theme logic in hooks (use utility)
- [ ] No useEffect state syncing (use useMemo)
- [ ] Types in `types.ts`, not inline
- [ ] Shared types in `src/types/screen.ts`
