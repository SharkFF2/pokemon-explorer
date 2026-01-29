import { Pokemon } from "@/types/pokemon"
import { buildFormQuery } from "./buildFormQuery"

export async function fetchPokemon(query: string | number): Promise<Pokemon> {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${query}`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    throw new Error("Pokémon not found")
  }

  return res.json()
}
