import { useEffect } from 'react'
import { useColorScheme } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { useTheme } from 'tamagui'
import { Provider } from './components/Provider'
import { usePokemonStore } from './store/pokemonStore'
import { usePokemonDataStore } from './store/pokemonDataStore'
import { fetchTypeList } from './services/api'
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
    /* (async () => {
      await AsyncStorage.clear()
    })() */
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
  const typeList = usePokemonStore((state) => state.typeList)
  const setTypeList = usePokemonStore((state) => state.setTypeList)
  
  // Use new data store for Pokemon list
  const fetchPokemonListAction = usePokemonDataStore((state) => state.fetchPokemonListAction)

  useEffect(() => {
    // Fetch Pokemon list using new store (handles caching internally)
    fetchPokemonListAction()

    // Only fetch if typeList is empty (not cached)
    if (typeList.length === 0) {
      console.log('Type list is empty, fetching from API...')
      fetchTypeList()
        .then((list) => {
          console.log('Successfully fetched and storing type list')
          setTypeList(list)
        })
        .catch((error) => {
          console.error('Failed to fetch type list:', error)
        })
    } else {
      console.log('Type list already cached, skipping API fetch')
    }
  }, [fetchPokemonListAction, typeList.length, setTypeList])

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
            title: '',
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
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="screens/pokemonDetails"
          options={{
            title: '',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="screens/typeFilter"
          options={{
            title: '',
            headerShown: false,
          }}
        />
      </Stack>
    </ThemeProvider>
  )
}
