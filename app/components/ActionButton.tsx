import { Button, Text } from 'tamagui'

interface ActionButtonProps {
  text: string
  onPress?: () => void
}

export function ActionButton({ text, onPress }: ActionButtonProps) {
  return (
    <Button
      onPress={onPress}
      borderWidth ={2}
      borderColor="$red"
      width="45%"
      height={70}
      pressStyle={{ scale: 0.95 }}
    >
      <Text color="$color.red" fontSize={18} fontWeight="500">
        {text}
      </Text>
    </Button>
  )
}
