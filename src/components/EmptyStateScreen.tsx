import { baseColors } from '@theme/colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GetThemeValueForKey, Text, YStack } from 'tamagui'

interface EmptyStateScreenProps {
  title: string
  subtitle?: string
  backgroundColor?: string
  titleColor?: GetThemeValueForKey<"color"> 
  subtitleColor?: GetThemeValueForKey<"color"> 
}

export default function EmptyStateScreen({
  title,
  subtitle,
  backgroundColor,
  titleColor,
  subtitleColor,
}: EmptyStateScreenProps) {
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
          textAlign="center"
          color={titleColor || '$text'}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            fontSize="$2"
            color={subtitleColor || '$text'}
            marginTop="$2"
          >
            {subtitle}
          </Text>
        )}
      </YStack>
    </SafeAreaView>
  )
}

