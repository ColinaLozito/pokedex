export type EvolutionSpriteContainerProps = {
  sprite: string
  name: string
  id: number
  isCurrent: boolean
  onPress: () => void
  variant?: 'linear' | 'branching-initial' | 'branching-variant'
}
