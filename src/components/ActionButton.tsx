import { Button, Text } from 'tamagui'

interface ActionButtonProps {
  text: string
  onPress?: () => void
}

export function ActionButton({ text, onPress }: ActionButtonProps) {
  
  return (
    <Button
      onPress={onPress}
      borderWidth="$1"
      borderColor="$red"
      width="45%"
      height="$6"
      backgroundColor="$white"
      pressStyle={{ scale: 0.95 }}
    >
      <Text color="$red" fontSize="$3" fontWeight="$5">
        {text}
      </Text>
    </Button>
  )
}
