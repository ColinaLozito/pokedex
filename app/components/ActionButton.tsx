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
      width="50%"
      height={70}
      style={{
        borderRadius: 16,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      pressStyle={{ scale: 0.95 }}
    >
      <Text color="$red" style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>{text}</Text>
    </Button>
  )
}
