import { baseColors } from '@theme/colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GetThemeValueForKey, Text, YStack } from 'tamagui'
import { ErrorScreenProps } from './types'

export default function ErrorScreen({
  error,
  onGoBack,
  goBackText = '← Go Back',
  backgroundColor,
  errorColor,
  goBackColor,
}: ErrorScreenProps) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: backgroundColor || baseColors.white,
      }}
    >
      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        padding="$4"
      >
        <Text
          fontSize="$4"
          color={(errorColor || '$red') as GetThemeValueForKey<"color">}
          textAlign="center"
        >
          {error}
        </Text>
        {onGoBack && (
          <>
            <YStack height="$5" />
            <Text
              fontSize="$3"
              color={(goBackColor || '$blue') as GetThemeValueForKey<"color">}
              textDecorationLine="underline"
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
