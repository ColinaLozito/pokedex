import { baseColors } from '@theme/colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text, YStack } from 'tamagui'

import { EmptyStateProps } from './types'

export default function EmptyStateScreen({
  title,
  subtitle,
  backgroundColor,
  titleColor,
  subtitleColor,
}: EmptyStateProps) {
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
