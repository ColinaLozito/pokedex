import { MainProvidersWrapper } from '@/providers/MainProvidersWrapper'
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
    if (fontsLoaded || fontError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, fontError])

  if (!fontsLoaded && !fontError) {
    return null
  }

  return (
    <MainProvidersWrapper>
      <RootLayoutNav />
    </MainProvidersWrapper>
  )
}

const defaultStackOptions: React.ComponentProps<typeof Stack.Screen>['options'] = {
  title: '',
  headerShown: true,
  headerTransparent: true,
}

const defaultModalOptions: React.ComponentProps<typeof Stack.Screen>['options'] = {
  presentation: 'transparentModal',
  headerShown: false,
  animation: 'fade',
}

function RootLayoutNav() {

  return (
    <ThemeProvider value={DefaultTheme}>
      <StatusBar style="dark" />
      <Stack>
       <Stack.Screen
          name="index"
          options={{
            ...defaultStackOptions,
            headerShown: false,
          }}
        />

         <Stack.Screen
            name="home"
            options={defaultStackOptions}
          />
        <Stack.Screen
          name="pokemonDetails"
          options={defaultStackOptions}
        />
        <Stack.Screen
          name="typeFilter"
          options={defaultStackOptions}
        />
        <Stack.Screen
          name="modals/loading"
          options={defaultModalOptions}
        />
      </Stack>
    </ThemeProvider>
  )
}
