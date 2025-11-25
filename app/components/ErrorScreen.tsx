import { SafeAreaView } from 'react-native-safe-area-context'
import { GetThemeValueForKey, Text, useTheme, YStack } from 'tamagui'

interface ErrorScreenProps {
  error: string
  onGoBack?: () => void
  goBackText?: string
  backgroundColor?: string
  errorColor?: string
  goBackColor?: string
}

export default function ErrorScreen({
  error,
  onGoBack,
  goBackText = '← Go Back',
  backgroundColor,
  errorColor,
  goBackColor,
}: ErrorScreenProps) {
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
        padding={16}
      >
        <Text
          fontSize={20}
          color={(errorColor || theme.red10?.val) as GetThemeValueForKey<"color"> || '#EF4444'}
          textAlign='center'
        >
          {error}
        </Text>
        {onGoBack && (
          <>
            <YStack height={20} />
            <Text
              fontSize={16}
              color={(goBackColor || theme.blue10?.val) as GetThemeValueForKey<"color"> || '#3B82F6'}
              textDecorationLine='underline'
              onPress={onGoBack}
            >
              {goBackText}
            </Text>
          </>
        )}
      </YStack>
    </SafeAreaView>
  )
}

