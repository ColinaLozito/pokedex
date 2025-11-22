import { useEffect } from 'react'
import { useColorScheme } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { useTheme } from 'tamagui'
import { Provider } from './components/Provider'
import { usePokemonStore } from './store/pokemonStore'
import { fetchPokemonList } from './services/api'
import Montserrat from '../assets/fonts/Montserrat.ttf'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Montserrat: Montserrat,
  })
  
  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, fontError])

  if (!fontsLoaded && !fontError) {
    return null
  }

  return (
    <Providers>
      <RootLayoutNav />
    </Providers>
  )
}

const Providers = ({ children }: { children: React.ReactNode }) => {
  const pokemonList = usePokemonStore((state) => state.pokemonList)
  const setPokemonList = usePokemonStore((state) => state.setPokemonList)

  useEffect(() => {
    // Only fetch if pokemonList is empty (not cached)
    if (pokemonList.length === 0) {
      console.log('Pokémon list is empty, fetching from API...')
      fetchPokemonList()
        .then((list) => {
          console.log('Successfully fetched and storing Pokémon list')
          setPokemonList(list)
        })
        .catch((error) => {
          console.error('Failed to fetch Pokémon list:', error)
        })
    } else {
      console.log('Pokémon list already cached, skipping API fetch')
    }
  }, [])

  return <Provider>{children}</Provider>
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()
  const theme = useTheme()

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="screens/home"
          options={{
            title: 'Pokédex',
            headerShown: false,
            headerStyle: {
              backgroundColor: theme.background.val,
            },
            headerTintColor: theme.color.val,
          }}
        />

        <Stack.Screen
          name="screens/parent"
          options={{
            title: '',
            headerShown: true,
            headerStyle: {
              backgroundColor: theme.red.val,
            },
            headerTintColor: theme.color.val,
          }}
        />

        <Stack.Screen
          name="screens/kid"
          options={{
            title: '',
            headerShown: true,
            headerStyle: {
              backgroundColor: theme.red.val,
            },
            headerTintColor: theme.color.val,
          }}
        />
      </Stack>
    </ThemeProvider>
  )
}
