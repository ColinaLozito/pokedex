import { Button, Text, useTheme } from 'tamagui'

interface ActionButtonProps {
  text: string
  onPress?: () => void
}

export function ActionButton({ text, onPress }: ActionButtonProps) {
  const theme = useTheme()
  
  return (
    <Button
      onPress={onPress}
      borderWidth={2}
      borderColor={theme.red?.val || '#FF0000'}
      width="45%"
      height={70}
      pressStyle={{ scale: 0.95 }}
    >
      <Text color={theme.red?.val || '#FF0000'} fontSize={18} fontWeight={500}>
        {text}
      </Text>
    </Button>
  )
}
