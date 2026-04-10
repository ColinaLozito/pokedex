import { Button, Text } from 'tamagui'
import { ActionButtonProps, DEFAULT_ACTION_BUTTON_TEST_ID } from './types'

export function ActionButton({
  text,
  onPress,
  testID = DEFAULT_ACTION_BUTTON_TEST_ID,
}: ActionButtonProps) {
  return (
    <Button
      onPress={onPress}
      borderWidth="$1"
      borderColor="$red"
      width="45%"
      height="$6"
      backgroundColor="$white"
      pressStyle={{ scale: 0.95 }}
      testID={testID}
    >
      <Text color="$red" fontSize="$3" fontWeight="$5">
        {text}
      </Text>
    </Button>
  )
}