import { EvolutionChainLink } from "app/services/api"
import { EvolutionNode } from "app/store/pokemonDetailsStore"
import { extractPokemonId } from "./extractPokemonId"
import { getPokemonSpriteUrl } from "./pokemonSprites"

/**
 * Convert EvolutionChainLink tree to a structured node tree
 */
export function buildEvolutionTree(chain: EvolutionChainLink): EvolutionNode {
  const id = extractPokemonId(chain.species.url)

  return {
    id,
    name: chain.species.name,
    sprite: getPokemonSpriteUrl(id),
    evolvesTo: chain.evolves_to.map(buildEvolutionTree),
  }
}

/**
 * Check if evolution chain is branching (has multiple paths)
 * For branching: initial Pokemon has more than 1 direct evolution
 */
export function isBranchingEvolution(chain: EvolutionChainLink): boolean {
  // If first Pokemon has more than 1 evolution, it's branching (like Eevee, Tyrogue)
  return chain.evolves_to.length > 1
}

/**
 * Recursively collect all descendant evolution nodes
 */
function collectAllDescendants(node: EvolutionNode): EvolutionNode[] {
  return node.evolvesTo.flatMap((evolution) => [
    evolution,
    ...collectAllDescendants(evolution),
  ])
}

/**
 * Collect all evolution variants from a branching node
 */
export function collectEvolutionVariants(node: EvolutionNode): EvolutionNode[] {
  return collectAllDescendants(node)
}