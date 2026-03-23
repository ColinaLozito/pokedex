type AbilityInfo = {
  ability: { name: string; url: string }
  is_hidden: boolean
}

export interface PokemonAbilitiesProps {
  abilities: AbilityInfo[]
}
