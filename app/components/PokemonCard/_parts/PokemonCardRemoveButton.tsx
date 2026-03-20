import { XStack, Button } from 'tamagui'
import { X } from '@tamagui/lucide-icons'
import { PokemonCardRemoveButtonProps } from '../types'
import { POKEMON_CARD_COLORS } from '../constants'

export default function PokemonCardRemoveButton({
  displayRemoveButton,
  onRemove,
  id
}: PokemonCardRemoveButtonProps) {
  if (!displayRemoveButton) return null

  return (
    <XStack position='absolute' top={6} right={6} zIndex={10}>
      <Button
        size={24}
        circular
        icon={X}
        chromeless
        backgroundColor={POKEMON_CARD_COLORS.buttonBackground}
        color="white"
        onPress={(e) => {
          e.stopPropagation();
          onRemove(id);
        }}
      />
    </XStack>
  )
}
