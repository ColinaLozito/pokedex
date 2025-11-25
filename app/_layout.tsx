import { DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import MontserratBlack from '../assets/fonts/Montserrat-Black.ttf'
import MontserratBold from '../assets/fonts/Montserrat-Bold.ttf'
import MontserratExtraBold from '../assets/fonts/Montserrat-ExtraBold.ttf'
import MontserratExtraLight from '../assets/fonts/Montserrat-ExtraLight.ttf'
import MontserratLight from '../assets/fonts/Montserrat-Light.ttf'
import MontserratMedium from '../assets/fonts/Montserrat-Medium.ttf'
import MontserratRegular from '../assets/fonts/Montserrat-Regular.ttf'
import MontserratSemiBold from '../assets/fonts/Montserrat-SemiBold.ttf'
import MontserratThin from '../assets/fonts/Montserrat-Thin.ttf'
import { Provider } from './components/Provider'
import { fetchTypeList } from './services/api'
import { usePokemonDataStore } from './store/pokemonDataStore'
import { usePokemonStore } from './store/pokemonStore'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router'

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Montserrat-Thin': MontserratThin,
    'Montserrat-ExtraLight': MontserratExtraLight,
    'Montserrat-Light': MontserratLight,
    'Montserrat-Regular': MontserratRegular,
    'Montserrat-Medium': MontserratMedium,
    'Montserrat-SemiBold': MontserratSemiBold,
    'Montserrat-Bold': MontserratBold,
    'Montserrat-ExtraBold': MontserratExtraBold,
    'Montserrat-Black': MontserratBlack,
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
      fetchTypeList()
        .then((list) => {
          setTypeList(list)
        })
        .catch((error) => {
          console.error('Failed to fetch type list:', error)
        })
    }
  }, [fetchPokemonListAction, typeList.length, setTypeList])

  return <Provider>{children}</Provider>
}

function RootLayoutNav() {

  return (
    <ThemeProvider value={DefaultTheme}>
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
            headerTransparent: true,
          }}
        />

        <Stack.Screen
          name="screens/parent"
          options={{
            title: '',
            headerShown: true,
            headerTransparent: true,
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
            headerShown: true,
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="screens/typeFilter"
          options={{
            title: '',
            headerShown: true,
            headerTransparent: true,
          }}
        />
      </Stack>
    </ThemeProvider>
  )
}
