import { YStack, Text, H2 } from 'tamagui'

export default function KidScreen() {
  return (
    <YStack
      flex={1}
      items="center"
      justify="center"
      px="$6"
      bg="$background"
    >
      <H2 mb="$4" color="$accent10">Kid Section</H2>
      <Text color="$color11">This is the kid section placeholder.</Text>
    </YStack>
  )
}

