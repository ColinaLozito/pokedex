# 🗺 Pokedex Project Map

- `/app`: Root of Expo Router (File-based Routing).
    - `/_layout.tsx`: Root nav layout and providers.
    - `/screens`: Dedicated screen components (called by routes).
    - `/components`: UI elements (Note: prefixed or nested to avoid route collision).
    - `/hooks`: Custom React hooks.
    - `/modals`: Modal screen definitions.
    - `/services`: API, Axios, and Data fetching logic.
    - `/store`: Zustand state management.
    - `/utils`: Helper functions.
- `/config`: **Source of Truth** for UI. Contains `tamagui.config.ts`, `colors.ts`, and `fonts.ts`.
- `/assets`: Static resources (images, icons, fonts).
- `/types`: TypeScript definitions for assets and global interfaces.