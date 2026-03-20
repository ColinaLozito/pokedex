# 🗺 Pokedex Project Map

- `/app`: Expo Router entrypoint.
  - `/_layout.tsx`: Root navigation + providers.
  - `/index.tsx`: Home route wrapper (`@/screens/home`).
  ...etc
  - `/modals/loading.tsx`: `@/modals/loading` modal route.
  ...etc
- `/src`: main app logic (linked into `app/*`).
  - `/screens`: screen components + state/navigation logic.
  - `/components`: UI components / small paged pieces.
  - `/hooks`: custom hooks.
  - `/modals`: modal business logic components.
  - `/services`: API + fetching logic.
  - `/store`: Zustand stores.
  - `/utils`: utilities/helpers.
- `/config`: UI constants.
  - `tamagui.config.ts`, `colors.ts`, `fonts.ts`.
- `/assets`: images/icons/fonts.
- `/types`: global types/asset typings.