import { Text, YStack } from 'tamagui'

interface RevealNameProps {
  name: string
  visible: boolean
}

export function RevealName({ name, visible }: RevealNameProps) {
  if (!visible) return null

  return (
    <YStack
      position="absolute"
      top={0}
      zIndex={9999}
      enterStyle={{ scale: 0, opacity: 0 }}
      transition="medium"
    >
      <Text
        fontSize={36}
        fontWeight="bold"
        color="$primary"
        textShadowColor="$secondary"
        textShadowRadius={8}
        textShadowOffset={{ width: 1, height: 1 }}
        textAlign="center"
      >
        {name}
      </Text>
    </YStack>
  )
}
