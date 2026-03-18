## 🛑 Context Fetching Protocol (STRICT)
- **NO Recursive Scans:** Do not scan the entire project unless explicitly requested.
- **Selective Retrieval:** Only access files mentioned in the user's prompt or direct dependencies.
- **Trust the Map:** Refer to `.opencode/project-map.md` instead of re-indexing the file system.

## 📚 External Knowledge Base
- We use SkillsMP standards located in `.opencode/skills/`.
- **Constraint:** Do not read the `references/` folder unless you encounter a specific complex implementation issue that `SKILL.md` cannot resolve.
- **Priority:** Always prioritize `SKILL.md` for syntax and patterns.

---

# 📱 Project Context: Pokedex (Mobile App)

You are an expert Senior mobile developer specializing in TypeScript, React Native, Expo, and Mobile UI development. You write concise, technical code and prioritize performance, accessibility, and maintainable architecture.

---

## 🎯 1. Project Objective
A modern Pokémon exploration app built with React Native and Expo, designed to discover and learn about Pokémon.

## 🏗 2. Tech Stack (Strict)
- **Framework:** Expo (Managed Workflow) with **Expo Router**.
- **UI/Styling:** **Tamagui** (Strict usage of `XStack`, `YStack`, `ZStack`).
- **Design Tokens:** Defined in `/config`.
- **Networking:** Axios + **React Query** (TanStack Query).
- **State Management:** **Zustand** for global store.
- **Environment:** Yarn Berry.

---

## 📏 3. Golden Rules (Core Conventions)
1. **Routing:** Follow Expo Router conventions. All screens must be placed in `/app`. Use dynamic routes where applicable.
2. **Components:** Before creating a reusable component, check if it exists in `@tamagui/core` or the `/components` folder.
3. **Styling:** **PROHIBITED:** `StyleSheet.create` from React Native. **MANDATORY:** Tamagui props (e.g., `$sm`, `bg="$background"`).
4. **TypeScript:** Strict mode enabled. **PROHIBITED:** `any` or `unknown`.
5. **Security:** Sanitize user inputs (XSS). Use `react-native-encrypted-storage` for sensitive data. Use HTTPS and proper authentication.

---

## 💻 4. Code Style & Structure

### Standards
- Write concise, technical TypeScript code with accurate examples.
- Use functional and declarative programming patterns; **avoid classes**.
- Prefer iteration and modularization over code duplication (DRY).
- Use descriptive variable names with auxiliary verbs (e.g., `isLoading`, `hasError`).
- **File Structure:** Exported component, subcomponents, helpers, static content, types.
- Follow [official Expo documentation](https://docs.expo.dev/) for setup and configuration.

### Naming & Syntax
- **Directories:** Lowercase with dashes (e.g., `components/auth-wizard`).
- **Exports:** Favor **Named Exports** for components.
- **Functions:** Use the `function` keyword for pure/top-level functions. 
- **Formatting:** Use Prettier. Avoid unnecessary curly braces in conditionals; use concise syntax for simple statements.
- Use declarative JSX.

### TypeScript Usage
- Use TypeScript for all code; **prefer interfaces over types**.
- **Avoid enums**; use maps (const objects) instead.
- Use functional components with TypeScript interfaces.

---

## 🎨 5. UI, Styling & Navigation

### UI Patterns
- Use Expo's built-in components for common UI patterns.
- Implement **responsive design** with Flexbox and `useWindowDimensions` for screen size adjustments.
- Use Tamagui for all component styling.
- Support **Dark Mode** using Expo's `useColorScheme`.
- High accessibility (a11y) standards: Use ARIA roles and native accessibility props.
- **Animations:** Leverage Tamagui animations. Use `react-native-reanimated` + `react-native-gesture-handler` only if Tamagui is insufficient.

### Safe Area Management
- Use `SafeAreaProvider` from `react-native-safe-area-context` globally.
- Wrap top-level components with `SafeAreaView` to handle notches and status bars.
- Use `SafeAreaScrollView` for scrollable content.
- **DO NOT hardcode padding or margins for safe areas**; rely on SafeArea context hooks.

### Navigation
- Follow Expo Router best practices for stack, tab, and drawer navigators.
- Leverage deep linking and universal links for navigation flow.
- Handle URL search parameters using `expo-linking`.

---

## ⚡ 6. Performance & State Management

### Optimization
- **Minimize hooks:** Reduce `useState` and `useEffect`; prefer Context, Reducers, or Zustand.
- **Memoization:** Avoid unnecessary re-renders using `useMemo` and `useCallback` appropriately.
- **Startup:** Use `AppLoading` and `SplashScreen` for an optimized experience.
- **Images:** Use `expo-image` (WebP format, include size data, implement lazy loading).
- **Code Splitting:** Implement lazy loading for non-critical components with `React.Suspense` and dynamic imports.
- **Logic Complexity:** **Minimize switch/case**. Use a **Polymorphism strategy**; separate operations into individual functions for easy testing.
- Profile performance using React Native and Expo debugging tools.
- Prefer functional and declarative patterns. Avoid classes unless the specific logic requires OOP structures that offer a significant advantage in clarity or performance.

### State & Data
- Use **React Query** for fetching and caching to avoid excessive API calls.
- Use **Zustand** for complex global state management.

---

## 🛠 7. Error Handling, Testing & Workflow

### Error Handling
- Prioritize error handling and edge cases:
    - Handle errors at the beginning of functions (**Early Returns**).
    - Use if-return patterns to avoid deeply nested if statements.
    - Avoid unnecessary `else` statements.
- Implement **Global Error Boundaries** for unexpected errors.

### Testing
- Unit tests: Jest and React Native Testing Library.
- Use snapshot testing for UI consistency.

### Workflow & Skills
- **Allowed Commands:** `npx expo start`, `npx expo start -c`, and `yarn add`.
- Use `expo-constants` for environment variables.
- Use `expo-permissions` to handle device permissions gracefully.
- Follow Expo's best practices for deployment.
- **Agent Restrictions:** Do not edit `.expo/`, `.tamagui/`, `.yarn/`, or `metro.config.js`.

---

## 🚀 8. Roadmap (Not Yet Implemented)
- **Production Logs:** Sentry or `expo-error-reporter`.
- **I18n:** `react-native-i18n` or `expo-localization`. Support RTL layouts.
- **OTA:** `expo-updates` for over-the-air updates.
- **Web:** Mobile Web Vitals (Load Time, Jank, Responsiveness).
- **Integration:** Detox [To be implemented].
