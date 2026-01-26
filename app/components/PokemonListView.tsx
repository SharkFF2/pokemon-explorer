import { useState } from "react";
import type { Pokemon } from "../../types/pokemon";
import { PokemonCard } from "./PokemonCard";

interface PokemonListViewProps {
  pokemon: Pokemon[];
  loading: boolean;
  rarityMap: Record<number, "normal" | "legendary" | "ultra" | "mythical">;
  onClose: () => void;
}

const regionRanges: Record<string, { name: string; range: [number, number] }> = {
  kanto: { name: "Gen 1 - Kanto", range: [1, 151] },
  johto: { name: "Gen 2 - Johto", range: [152, 251] },
  hoenn: { name: "Gen 3 - Hoenn", range: [252, 386] },
  sinnoh: { name: "Gen 4 - Sinnoh", range: [387, 493] },
  unova: { name: "Gen 5 - Unova", range: [494, 649] },
  kalos: { name: "Gen 6 - Kalos", range: [650, 721] },
  alola: { name: "Gen 7 - Alola", range: [722, 809] },
  galar: { name: "Gen 8 - Galar", range: [810, 905] },
  paldea: { name: "Gen 9 - Paldea", range: [906, 1025] },
};

function getRegionForId(id: number): string {
  for (const [regionKey, data] of Object.entries(regionRanges)) {
    const [min, max] = data.range;
    if (id >= min && id <= max) {
      return regionKey;
    }
  }
  return "unknown";
}

export function PokemonListView({
  pokemon,
  loading,
  rarityMap,
  onClose,
}: PokemonListViewProps) {
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [shine, setShine] = useState<"normal" | "shiny">("normal");
  const [facing, setFacing] = useState<"front" | "back">("front");

  if (selectedPokemon) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-slate-800 rounded-lg max-w-2xl w-full p-6 border border-slate-700">
          <button
            onClick={() => setSelectedPokemon(null)}
            className="mb-4 px-4 py-2 rounded-lg bg-slate-700 text-slate-100 hover:bg-slate-600 font-semibold"
          >
            ← Back to List
          </button>
          <PokemonCard
            pokemon={selectedPokemon}
            rarity={rarityMap[selectedPokemon.id] || "normal"}
            gender={gender}
            shine={shine}
            facing={facing}
            hasFemale={
              selectedPokemon.sprites.front_female !== null ||
              selectedPokemon.sprites.back_female !== null ||
              selectedPokemon.sprites.front_shiny_female !== null ||
              selectedPokemon.sprites.back_shiny_female !== null
            }
            hasShiny={
              selectedPokemon.sprites.front_shiny !== null ||
              selectedPokemon.sprites.back_shiny !== null ||
              selectedPokemon.sprites.front_shiny_female !== null ||
              selectedPokemon.sprites.back_shiny_female !== null
            }
            spriteUrl={getSpriteUrl(selectedPokemon, gender, shine, facing)}
            glowClass={getGlowClass(rarityMap[selectedPokemon.id] || "normal", shine)}
            onGenderChange={setGender}
            onShineChange={setShine}
            onFacingChange={setFacing}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 border border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-100">
            Filtered Pokémon ({pokemon.length})
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 text-2xl"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <p className="text-center text-slate-400">Loading Pokémon...</p>
        ) : pokemon.length === 0 ? (
          <p className="text-center text-slate-400">
            No Pokémon found matching your filters.
          </p>
        ) : (
          <div>
            {Object.entries(regionRanges).map(([regionKey, regionData]) => {
              const pokemonInRegion = pokemon.filter((p) => {
                const [min, max] = regionData.range;
                return p.id >= min && p.id <= max;
              });

              if (pokemonInRegion.length === 0) return null;

              return (
                <div key={regionKey} className="mb-8">
                  <h3 className="text-lg font-bold text-emerald-400 mb-4 pb-2 border-b border-slate-700">
                    {regionData.name}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {pokemonInRegion.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPokemon(p)}
                        className="p-4 rounded-lg bg-slate-700 hover:bg-slate-600 transition border border-slate-600 hover:border-emerald-500 relative"
                      >
                        {rarityMap[p.id] !== "normal" && (
                          <div className="absolute top-2 right-2">
                            <span
                              className={`text-xs px-2 py-1 rounded font-semibold capitalize ${
                                rarityMap[p.id] === "mythical"
                                  ? "bg-pink-500 text-white"
                                  : rarityMap[p.id] === "ultra"
                                  ? "bg-red-500 text-white"
                                  : "bg-yellow-500 text-slate-900"
                              }`}
                            >
                              {rarityMap[p.id]}
                            </span>
                          </div>
                        )}
                        <div className="flex flex-col items-center gap-2">
                          <img
                            src={p.sprites.front_default || ""}
                            alt={p.name}
                            className="w-20 h-20"
                          />
                          <div>
                            <p className="font-semibold text-slate-100 capitalize">
                              {p.name}
                            </p>
                            <p className="text-xs text-slate-400">#{p.id}</p>
                          </div>
                          <div className="flex flex-wrap gap-1 justify-center">
                            {p.types.map((t) => (
                              <span
                                key={t.type.name}
                                className="text-xs px-2 py-1 rounded bg-slate-600 text-slate-200 capitalize"
                              >
                                {t.type.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function getSpriteUrl(
  pokemon: Pokemon,
  gender: "male" | "female",
  shine: "normal" | "shiny",
  facing: "front" | "back"
) {
  const s = pokemon.sprites;
  const isFemale = gender === "female";
  const isShiny = shine === "shiny";
  const isFront = facing === "front";

  if (!isFemale && !isShiny && isFront) return s.front_default;
  if (!isFemale && !isShiny && !isFront) return s.back_default;
  if (!isFemale && isShiny && isFront) return s.front_shiny;
  if (!isFemale && isShiny && !isFront) return s.back_shiny;
  if (isFemale && !isShiny && isFront) return s.front_female ?? s.front_default;
  if (isFemale && !isShiny && !isFront) return s.back_female ?? s.back_default;
  if (isFemale && isShiny && isFront)
    return s.front_shiny_female ?? s.front_shiny ?? s.front_default;
  if (isFemale && isShiny && !isFront)
    return s.back_shiny_female ?? s.back_shiny ?? s.back_default;

  return s.front_default;
}

function getGlowClass(rarity: string, shine: string): string {
  if (rarity === "mythical")
    return "border-pink-400 shadow-[0_0_20px_rgba(244,114,182,0.7)] bg-slate-900";
  if (rarity === "ultra")
    return "border-red-400 shadow-[0_0_20px_rgba(248,113,113,0.7)] bg-slate-900";
  if (rarity === "legendary")
    return "border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.7)] bg-slate-900";
  if (shine === "shiny")
    return "border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.7)] bg-slate-900";
  return "border-slate-700 bg-slate-900";
}
