import { ButtonProps } from 'tamagui'
import { TEST_IDS } from '@/shared/tests/mocks/test-ids'

export type BookmarkButtonProps = ButtonProps & {
  isBookmarked: boolean
  testID?: string
}

export const DEFAULT_BOOKMARK_BUTTON_TEST_ID = TEST_IDS.shared.bookmarkButton
