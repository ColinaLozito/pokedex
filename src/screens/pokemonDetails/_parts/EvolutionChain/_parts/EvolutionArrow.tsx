import { View } from 'react-native'
import { Text } from 'tamagui'

export default function EvolutionArrow() {
  return (
    <View style={{ transform: [{ rotate: '90deg' }] }}>
      <Text color="$doveGray" fontSize="$4">➡</Text>
    </View>
  )
}
