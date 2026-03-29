import { TEST_IDS } from '@/shared/tests/mocks/test-ids'

export interface ActionButtonProps {
  text: string
  onPress?: () => void
  testID?: string
}

export const DEFAULT_ACTION_BUTTON_TEST_ID = TEST_IDS.shared.actionButton
