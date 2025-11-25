import type { EvolutionChainLink } from "app/services/types"
import { extractPokemonId } from "./extractPokemonId"
import { getPokemonSpriteUrl } from "./pokemonSprites"

export interface EvolutionNode {
  id: number
  name: string
  sprite: string
  evolvesTo: EvolutionNode[]
}

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

/**
 * Extract evolution chain into a flat array of Pokemon
 * Returns array of { name, url } for each Pokemon in the chain
 */
export function extractEvolutionChain(chain: EvolutionChainLink): { name: string; url: string }[] {
  const pokemon: { name: string; url: string }[] = []
  
  const traverse = (link: EvolutionChainLink) => {
    pokemon.push({
      name: link.species.name,
      url: link.species.url
    })
    
    if (link.evolves_to && link.evolves_to.length > 0) {
      link.evolves_to.forEach(traverse)
    }
  }
  
  traverse(chain)
  return pokemon
}