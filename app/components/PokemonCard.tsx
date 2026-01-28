import type { Pokemon } from "../../types/pokemon";
import { Rarity } from "../constants";
import { RarityBadge } from "./RarityBadge";
import { VariantControls } from "./VariantControls";
import { StatsDisplay } from "./StatsDisplay";
import { PokemonSprite } from "./PokemonSprite";

type Gender = "male" | "female";
type Shine = "normal" | "shiny";
type Facing = "front" | "back";

interface PokemonCardProps {
  pokemon: Pokemon;
  rarity: Rarity;
  gender: Gender;
  shine: Shine;
  facing: Facing;
  hasFemale: boolean;
  hasShiny: boolean;
  spriteUrl: string | null;
  glowClass: string;
  onGenderChange: (gender: Gender) => void;
  onShineChange: (shine: Shine) => void;
  onFacingChange: (facing: Facing) => void;
}

export function PokemonCard({
  pokemon,
  rarity,
  gender,
  shine,
  facing,
  hasFemale,
  hasShiny,
  spriteUrl,
  glowClass,
  onGenderChange,
  onShineChange,
  onFacingChange,
}: PokemonCardProps) {
  // Type color logic for card background

  
  const typeColors: Record<string, string> = {
    normal: '#A8A77A',
	fire: '#EE8130',
	water: '#6390F0',
	electric: '#F7D02C',
	grass: '#7AC74C',
	ice: '#96D9D6',
	fighting: '#C22E28',
	poison: '#A33EA1',
	ground: '#E2BF65',
	flying: '#A98FF3',
	psychic: '#F95587',
	bug: '#A6B91A',
	rock: '#B6A136',
	ghost: '#735797',
	dragon: '#6F35FC',
	dark: '#705746',
	steel: '#B7B7CE',
	fairy: '#D685AD',
  };

  const bgClass = (() => {
    if (!pokemon || !Array.isArray(pokemon.types) || pokemon.types.length === 0) {
      return "bg-slate-800";  // Default
    }
    const types = pokemon.types.map(t => t.type.name.toLowerCase());
    const colors = types.map(type => typeColors[type] || "#1e293b").filter(Boolean);
    if (colors.length === 1) {
      return `bg-[${colors[0]}]`;
    } else if (colors.length >= 2) {
      // For dual types, we'll render separate background divs
      return "bg-slate-800"; // Fallback, but we'll override with divs
    }
    return "bg-slate-800";
  })();

  const backgroundElements = (() => {
    if (!pokemon || !Array.isArray(pokemon.types) || pokemon.types.length === 0) {
      return null;
    }
    const types = pokemon.types.map(t => t.type.name.toLowerCase());
    const colors = types.map(type => typeColors[type] || "#1e293b").filter(Boolean);
    if (colors.length === 1) {
      return <div className="absolute inset-0 rounded-xl z-0" style={{ backgroundColor: colors[0] }} />;
    } else if (colors.length >= 2) {
      return (
        <div className="absolute inset-0 rounded-xl z-0" style={{ background: `linear-gradient(to right, ${colors[0]} 45%, ${colors[1]} 55%)` }} />
      );
    }
    return null;
  })();

  return (
    <div className="relative flex flex-col md:flex-row gap-3 md:gap-6 rounded-xl shadow-xl p-3 md:p-6 min-h-50 max-w-4xl mx-auto w-full">
      {backgroundElements}
      <div className="relative z-10 flex flex-col md:flex-row gap-3 md:gap-6 w-full">
        <VariantControls
          gender={gender}
          shine={shine}
          hasFemale={hasFemale}
          hasShiny={hasShiny}
          onGenderChange={onGenderChange}
          onShineChange={onShineChange}
        />

        <PokemonSprite
          spriteUrl={spriteUrl}
          facing={facing}
          gender={gender}
          shine={shine}
          onFacingChange={onFacingChange}
          glowClass={glowClass}
        />

        <div className="flex-1">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 mb-2">
            <h2 className="text-xl md:text-2xl font-bold capitalize whitespace-nowrap">
              {pokemon.name} <span className="text-white">#{pokemon.id}</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              <RarityBadge rarity={rarity} isShiny={shine === "shiny"} />
            </div>
          </div>

          <StatsDisplay stats={pokemon.stats} />
        </div>
      </div>
    </div>
  );
}