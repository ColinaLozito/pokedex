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