import { Button } from '@tamagui/button'
import { baseColors } from '@theme/colors'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Card, Text, YStack } from 'tamagui'
import type { ErrorFallbackProps } from './types'

export default function ErrorFallback({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: baseColors.white,
      }}
    >
      <YStack
        flex={1}
        justifyContent="center"
         alignItems="center"
        padding="$4"
        gap="$4"
      >
        <Card
          borderWidth={1}
          borderColor="$border"
          backgroundColor="$white"
          padding="$6"
          borderRadius="$4"
          width="100%"
          maxWidth={400}
        >
          <YStack  alignItems="center" gap="$3">
            <Text
              fontSize="$8"
              fontWeight="700"
              color="$red"
              textAlign="center"
            >
              Oops!
            </Text>

            <Text
              fontSize="$5"
              fontWeight="500"
              color="$text"
              textAlign="center"
            >
              Something went wrong
            </Text>

            <Text
              fontSize="$3"
              color="$doveGray"
              textAlign="center"
            >
              Don&apos;t worry, it&apos;s not your fault. Let&apos;s get you back on track!
            </Text>

            <YStack height="$4" />

            <Button
              onPress={resetErrorBoundary}
              backgroundColor="$primary"
              borderRadius="$3"
              paddingHorizontal="$6"
              paddingVertical="$3"
            >
              <Text color="$text" fontWeight="600">Try Again</Text>
            </Button>

            <YStack height="$2" />

            <Text
              fontSize="$2"
              color="$doveGray"
              textAlign="center"
              onPress={() => setShowDetails(!showDetails)}
            >
              {showDetails ? '▼ Hide details' : '▶ Show details'}
            </Text>

            {showDetails && (
              <YStack
                backgroundColor="$wildSand"
                padding="$3"
                borderRadius="$2"
                width="100%"
              >
                <Text fontSize="$1" color="$red">
                  {error instanceof Error ? error.message : String(error)}
                </Text>
              </YStack>
            )}
          </YStack>
        </Card>
      </YStack>
    </SafeAreaView>
  )
}
