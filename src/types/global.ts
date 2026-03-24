import { PokemonCardData } from "@/components/pokemon/PokemonCard/types"

export type PokemonDisplayData = Omit<PokemonCardData, 'variant'> 

export type PokemonDisplayDataArray = Array<PokemonDisplayData>
