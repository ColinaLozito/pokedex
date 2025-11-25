# Pokédex App

A modern Pokémon exploration app built with React Native and Expo, designed for both parents and kids to discover and learn about Pokémon together.

## 🎯 Overview

This Pokédex application provides two distinct user experiences:
- **Parent Mode**: Daily Pokémon discovery with a fun roulette system and bookmarking
- **Kid Mode**: Interactive exploration with search, filtering, and bookmarking

The app fetches data from the [PokéAPI](https://pokeapi.co/) and provides a smooth, performant experience with offline capabilities through persistent storage.
The pokemons are stored locally while the user inspect them the first time

## ✨ Features

### Parent Screen
- **Daily Pokémon Roulette**: Spin a number roulette (#0001-#1000) to discover a random Pokémon
- **Pokémon of the Day**: Automatic daily Pokémon selection with retry functionality
- **Bookmarking**: Save favorite Pokémon in a separate parent bookmark list

### Kid Screen
- **Search**: Autocomplete search to find any Pokémon by name
- **Type Filtering**: Browse Pokémon by type with visual type grid
- **Recent Selections**: Quick access to the last 5 viewed Pokémon
- **Bookmarking**: Personal bookmark list for favorite Pokémon

### Pokémon Details
- **Comprehensive Information**: Stats, abilities, types, attributes
- **Evolution Chain Visualization**: Interactive evolution tree with branching support
- **Context-Aware Bookmarking**: Bookmarks sync based on navigation source (parent/kid)

## 🛠 Tech Stack

- **React Native** (0.81.5) - Mobile framework
- **Expo** (~54.0.25) - Development platform
- **Expo Router** (~6.0.15) - File-based routing
- **TypeScript** (~5.9.2) - Type safety
- **Tamagui** (^1.138.0) - Universal design system
- **Zustand** (^5.0.8) - State management
- **AsyncStorage** (^2.2.0) - Persistent storage
- **Axios** (^1.13.2) - HTTP client

## 📁 Project Structure

```
app/
├── components/    # Reusable UI components (cards, buttons, badges, etc.)
├── hooks/         # Custom React hooks (modal management, loading states)
├── modals/        # Modal screens (roulette, loading)
├── screens/       # Main application screens (home, parent, kid, details, filters)
├── services/      # API services and type definitions
├── store/         # Zustand stores (data, general, daily, modal state)
└── utils/         # Utility functions (date, evolution tree, sprites, colors)
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** v20.19.5
- **Yarn** 4.5.0
- iOS Simulator (for iOS) or Android Emulator (for Android)
- Expo CLI (installed globally or via `yarn dlx`)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pokedex
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Start the development server**
   ```bash
   yarn start
   ```

4. **Run on a platform**
   - iOS: `yarn ios`
   - Android: `yarn android`
   - Web: `yarn web`

## 📱 Available Scripts

- `yarn start` - Start Expo development server
- `yarn ios` - Run on iOS simulator
- `yarn android` - Run on Android emulator
- `yarn lint` - Run ESLint
- `yarn lint:fix` - Fix ESLint errors automatically
- `yarn format` - Format code with Prettier
- `yarn format:check` - Check code formatting

## 🏗 Architecture Highlights

### State Management
- **Zustand stores** for centralized state management
- **Persistent storage** with AsyncStorage for offline support
- **Promise-based fetch deduplication** to prevent duplicate API calls

### Navigation
- **Expo Router** for file-based routing
- **Modal system** with transparent presentation for overlays

### Performance
- Memoization with `useCallback` and `useMemo`
- Selective re-renders with individual Zustand selectors
- Background pre-fetching of evolution chain details

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- [PokéAPI](https://pokeapi.co/) for providing the Pokémon data
- [Tamagui](https://tamagui.dev/) for the design system
- [Expo](https://expo.dev/) for the development platform

## 🚀 Future Enhancements

### Possible Features (Second Iteration)
- **Filter by Generation**: Browse Pokémon by generation
- **Pokémon Cries**: Button to reproduce Pokémon cry sounds
- **Animations**: Enhanced animations using Tamagui animation system
- **Mini Game**: Parent section mini-game to populate a Pokémon album based on generations
- **Enhanced Details**: More comprehensive Pokémon detail information

### Possible Improvements
- **Text Management**: Better inline text implementation with a global store for centralized text management
- **Sprite Optimization**: 
  - Download all Pokémon sprites in-app for better and smoother rendering (investigate memory impact)
  - Or implement asset loading placeholders in Pokémon cards
- **UI Enhancements**: Add type symbols to Pokémon cards (styling improvements)
- **Bookmark Limits**: Implement bookmark max counter
- **Typography System**: Better typography system for more consistent implementation
- **Responsive Design**: Optimize for multiple device screen sizes and scale elements according to screen (heavy task)

