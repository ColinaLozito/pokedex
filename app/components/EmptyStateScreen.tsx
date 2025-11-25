import { SafeAreaView } from 'react-native-safe-area-context'
import { Text, useTheme, YStack } from 'tamagui'

interface EmptyStateScreenProps {
  title: string
  subtitle?: string
  backgroundColor?: string
  titleColor?: string
  subtitleColor?: string
}

export default function EmptyStateScreen({
  title,
  subtitle,
  backgroundColor,
  titleColor,
  subtitleColor,
}: EmptyStateScreenProps) {
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
        style={{ justifyContent: 'center', alignItems: 'center', padding: 16 }}
      >
        <Text
          fontSize={20}
          style={{ textAlign: 'center' }}
          color={titleColor || theme.text.val}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            fontSize={14}
            style={{
              color: subtitleColor || theme.gray10?.val || '#737373',
              marginTop: 8,
            }}
          >
            {subtitle}
          </Text>
        )}
      </YStack>
    </SafeAreaView>
  )
}

