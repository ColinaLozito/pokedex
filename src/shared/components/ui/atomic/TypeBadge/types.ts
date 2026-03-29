import { TEST_IDS } from '@/shared/tests/mocks/test-ids'

export type TypeBadgeProps = {
  typeName: string
  size?: 'small' | 'medium' | 'large'
  testID?: string
}

export const DEFAULT_TYPE_BADGE_TEST_ID = TEST_IDS.shared.typeBadge
