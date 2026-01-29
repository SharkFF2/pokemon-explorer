import type { Pokemon } from "@/types/pokemon"
import { Variant } from "../page"
import "../globals.css"

type Props = {
  pokemon: Pokemon | null
  error: string | null
  variant: Variant
}

export const PanelLayout: React.FC<Props> = ({ pokemon, error, variant }) => {
  if (error) {
    return <div className="text-red-400">{error}</div>
  }

  if (!pokemon) {
    return <div className="opacity-50">Search for a Pokémon</div>
  }

  return (
    <div className="grid grid-cols-[300px_1fr] grid-rows-2 gap-6 w-full h-full p-4">
      
      {/* Sprite */}
      <div className={` row-span-2 rounded-lg glass flex items-center justify-center ${variant === "shiny" ? "pulse-glow" : ""} `}>
        <img
          src= {
            variant === "shiny"
              ? pokemon.sprites.front_shiny ?? ""
              : pokemon.sprites.front_default ?? ""
          }
            
          alt={pokemon.name}
          className="pixelated"
        />
      </div>

      {/* Stats */}
      <div className="rounded-lg glass p-4">
        {pokemon.stats.map(stat => (
          <div key={stat.stat.name}>
            {stat.stat.name}: {stat.base_stat}
          </div>
        ))}
      </div>

      {/* Meta */}
      <div className="rounded-lg glass p-4">
        <div>Name: {pokemon.name}</div>
        <div>
          Type: {pokemon.types.map(t => t.type.name).join(", ")}
        </div>
      </div>
    </div>
  )
}
