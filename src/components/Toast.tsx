import { Toast, useToastState } from '@tamagui/toast'
import { YStack } from 'tamagui'

export function CurrentToast() {
  const currentToast = useToastState()

  if (!currentToast || currentToast.isHandledNatively) return null

  return (
    <Toast
      key={currentToast.id}
      duration={currentToast.duration}
      viewportName={currentToast.viewportName}
      enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      theme="accent"
      rounded="$4"
      animation="quick"
      maxWidth={300}
    >
      <YStack items="center" p="$2" gap="$2">
        <Toast.Title fontWeight="$7">{currentToast.title}</Toast.Title>
        {!!currentToast.message && (
          <Toast.Description color="$text">{currentToast.message}</Toast.Description>
        )}
      </YStack>
    </Toast>
  )
}
