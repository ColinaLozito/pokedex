import { Bookmark, BookmarkCheck } from '@tamagui/lucide-icons'
import { Button, useTheme } from 'tamagui'
import { BookmarkButtonProps, DEFAULT_BOOKMARK_BUTTON_TEST_ID } from './types'

export default function BookmarkButton({
  isBookmarked,
  testID = DEFAULT_BOOKMARK_BUTTON_TEST_ID,
  ...buttonProps
}: BookmarkButtonProps) {
  const theme = useTheme()

  return (
    <Button
      circular
      elevate
      icon={isBookmarked ? BookmarkCheck : Bookmark}
      color={theme?.text?.val ?? '$white'}
      shadowColor={"$opacity1"}
      shadowOpacity={0.3}
      shadowRadius="$2"
      testID={testID}
      {...buttonProps}
    />
  )
}
