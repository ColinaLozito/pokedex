import { ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text, useTheme, YStack } from 'tamagui'

interface LoadingScreenProps {
  message?: string
  backgroundColor?: string
  indicatorColor?: string
  textColor?: string
}

export default function LoadingScreen({
  message = 'Loading...',
  backgroundColor,
  indicatorColor,
  textColor,
}: LoadingScreenProps) {
  const theme = useTheme()

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: backgroundColor || theme.background.val,
      }}
    >
      <YStack
        flex={1}
        justifyContent='center'
        alignItems='center'
      >
        <ActivityIndicator
          size="large"
          color={indicatorColor || theme.color.val}
        />
        <Text marginTop={16} color={textColor || theme.text.val}>
          {message}
        </Text>
      </YStack>
    </SafeAreaView>
  )
}

