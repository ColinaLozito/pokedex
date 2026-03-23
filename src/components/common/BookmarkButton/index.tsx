import { Bookmark, BookmarkCheck } from '@tamagui/lucide-icons'
import { Button, useTheme } from 'tamagui'
import { BookmarkButtonProps } from './types'

export default function BookmarkButton({
  isBookmarked,
  ...buttonProps
}: BookmarkButtonProps) {
  const theme = useTheme()

  return (
    <Button
      circular
      elevate
      icon={isBookmarked ? BookmarkCheck : Bookmark}
      color={theme.text.val}
      shadowColor={"$opacity1"}
      shadowOpacity={0.3}
      shadowRadius="$2"
      {...buttonProps}
    />
  )
}
