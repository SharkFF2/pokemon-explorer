"use client";

import { useState, useEffect, useMemo, useCallback, FormEvent } from "react";
import type { Pokemon } from "../types/pokemon";
import {
  MYTHICAL_LIST,
  ULTRA_BEAST_LIST,
  LEGENDARY_LIST,
  RARITIES,
  roll,
  type Rarity
} from "./constants";
import { SearchForm } from "./components/SearchForm";
import { PokemonCard } from "./components/PokemonCard";
import { Toast } from "./components/Toast";
import RegionSelector from "./components/RegionSelector";

type Gender = "male" | "female";
type Shine = "normal" | "shiny";
type Facing = "front" | "back";

const typeColors: Record<string, string> = {
  normal: "bg-gray-600",
  fire: "bg-red-600",
  water: "bg-blue-600",
  electric: "bg-yellow-500",
  grass: "bg-green-600",
  ice: "bg-blue-300",
  fighting: "bg-red-800",
  poison: "bg-purple-600",
  ground: "bg-yellow-800",
  flying: "bg-sky-500",
  psychic: "bg-pink-500",
  bug: "bg-green-800",
  rock: "bg-gray-700",
  ghost: "bg-purple-900",
  dragon: "bg-indigo-600",
  dark: "bg-gray-900",
  steel: "bg-gray-400",
  fairy: "bg-pink-400",
}

export default function HomePage() {
  const [rarity, setRarity] = useState<Rarity>("normal");  // Moved inside the component
  const [query, setQuery] = useState("");
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gender, setGender] = useState<Gender>("male");
  const [shine, setShine] = useState<Shine>("normal");
  const [facing, setFacing] = useState<Facing>("front");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Memoize rarity sets for O(1) lookups
  const raritySets = useMemo(() => ({
    mythical: new Set(MYTHICAL_LIST),
    ultra: new Set(ULTRA_BEAST_LIST),
    legendary: new Set(LEGENDARY_LIST),
  }), []);

const performSearch = useCallback(async (searchQuery: string) => {
  if (!searchQuery.trim()) return;

  setLoading(true);
  setError(null);
  setPokemon(null);

  try {
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${searchQuery.toLowerCase().trim()}`
    );
    if (!res.ok) {
      throw new Error("Pokémon not found");
    }
    const data: Pokemon = await res.json();
    setPokemon(data);

    // Determine rarity based on ID
    let determinedRarity: Rarity = "normal";
    if (raritySets.mythical.has(data.id)) {
      determinedRarity = "mythical";
    } else if (raritySets.ultra.has(data.id)) {
      determinedRarity = "ultra";
    } else if (raritySets.legendary.has(data.id)) {
      determinedRarity = "legendary";
    }
    setRarity(determinedRarity);

    // Set toast for special rarities (matching random logic)
    if (determinedRarity === "mythical") {
      setToast("🌸 You found a MYTHICAL Pokémon!");
    } else if (determinedRarity === "ultra") {
      setToast("🔥 You found an ULTRA BEAST!");
    } else if (determinedRarity === "legendary") {
      setToast("✨ You found a LEGENDARY Pokémon!");
    }

    setGender("male");
    setShine("normal");
    setFacing("front");
  } catch (err: any) {
    setError(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
}, [raritySets]);

const handleSearch = useCallback(async (e?: FormEvent) => {
  if (e) e.preventDefault();
  performSearch(query);
}, [query, performSearch]);

  // RANDOM POKÉMON GENERATOR
  const rollRarity = (): Rarity => {
    const r = Math.random();
    let acc = 0;

    for (const rarity of RARITIES) {
      acc += rarity.chance;
      if (r < acc) return rarity.key;
    }

    return "normal";
  };

 const getRandomPokemon = useCallback(async () => {
  setLoading(true);
  setError(null);

  try {
    const rolledRarity = rollRarity();
    // Note: rolledRarity is used to select the ID pool, but final rarity is determined by the actual Pokémon's ID

    let id: number;

    switch (rolledRarity) {
      case "mythical":
        id = MYTHICAL_LIST[Math.floor(Math.random() * MYTHICAL_LIST.length)];
        break;
      case "ultra":
        id = ULTRA_BEAST_LIST[Math.floor(Math.random() * ULTRA_BEAST_LIST.length)];
        break;
      case "legendary":
        id = LEGENDARY_LIST[Math.floor(Math.random() * LEGENDARY_LIST.length)];
        break;
      default:
        id = Math.floor(Math.random() * 1025) + 1;
    }

    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!res.ok) throw new Error("Failed to fetch Pokémon");

    const data: Pokemon = await res.json();
    setPokemon(data);

    // Determine final rarity based on the actual Pokémon's ID (overrides rolledRarity if needed)
    let finalRarity: Rarity = "normal";
    if (raritySets.mythical.has(data.id)) {
      finalRarity = "mythical";
    } else if (raritySets.ultra.has(data.id)) {
      finalRarity = "ultra";
    } else if (raritySets.legendary.has(data.id)) {
      finalRarity = "legendary";
    }
    setRarity(finalRarity);

    // Gender (10% if available)
    if (roll(0.1) && data.sprites.front_female) {
      setGender("female");
    } else {
      setGender("male");
    }

    // Shiny (1 / 200)
    const isShiny = roll(1 / 200);
    setShine(isShiny ? "shiny" : "normal");

    setFacing("front");

    // Toasts (priority-based, using finalRarity)
    if (finalRarity === "mythical") {
      setToast("🌸 You found a MYTHICAL Pokémon!");
    } else if (finalRarity === "ultra") {
      setToast("🔥 You found an ULTRA BEAST!");
    } else if (finalRarity === "legendary") {
      setToast("✨ You found a LEGENDARY Pokémon!");
    } else if (isShiny) {
      setToast("⭐ You found a SHINY Pokémon!");
    }

  } catch {
    setError("Failed to load random Pokémon");
  } finally {
    setLoading(false);
  }
}, [raritySets]);

  // Auto-hide toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const getCurrentSprite = useCallback(() => {
    if (!pokemon) return null;
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
  }, [pokemon, gender, shine, facing]);

  const spriteUrl = useMemo(() => getCurrentSprite(), [getCurrentSprite]);

  // Variant detection
  const hasFemale = useMemo(() =>
    pokemon?.sprites.front_female !== null ||
    pokemon?.sprites.back_female !== null ||
    pokemon?.sprites.front_shiny_female !== null ||
    pokemon?.sprites.back_shiny_female !== null,
    [pokemon]
  );

  const hasShiny = useMemo(() =>
    pokemon?.sprites.front_shiny !== null ||
    pokemon?.sprites.back_shiny !== null ||
    pokemon?.sprites.front_shiny_female !== null ||
    pokemon?.sprites.back_shiny_female !== null,
    [pokemon]
  );

  // Memoize glow class
  const glowClass = useMemo(() => {
    if (!pokemon) return "border-slate-700 bg-slate-900";
    if (rarity === "mythical") return RARITIES[0].glowClass;
    if (rarity === "ultra") return RARITIES[1].glowClass;
    if (rarity === "legendary") return RARITIES[2].glowClass;
    if (shine === "shiny") return "border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.7)] bg-slate-900";
    return "border-slate-700 bg-slate-900";
  }, [pokemon, rarity, shine]);

  useEffect(() => {
    if (!pokemon) return;

    if (!hasFemale && gender === "female") {
      setGender("male");
    }

    if (!hasShiny && shine === "shiny") {
      setShine("normal");
    }
  }, [pokemon, hasFemale, hasShiny, gender, shine]);

  return (
    <main className={`min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4`}>
      <Toast message={toast} />

      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Pokémon Viewer</h1>

        <SearchForm
          query={query}
          loading={loading}
          onQueryChange={setQuery}
          onSearch={handleSearch}
          onRandom={getRandomPokemon}
        />

        {pokemon && (
          <RegionSelector
            speciesUrl={pokemon.species.url}
            onSelectForm={(name) => performSearch(name)}
          />
        )}

        {error && (
          <p className="text-center text-red-400 mb-4 font-medium">{error}</p>
        )}

        {pokemon && (
          <PokemonCard
            pokemon={pokemon}
            rarity={rarity!}
            gender={gender}
            shine={shine}
            facing={facing}
            hasFemale={hasFemale}
            hasShiny={hasShiny}
            spriteUrl={spriteUrl}
            glowClass={glowClass}
            onGenderChange={setGender}
            onShineChange={setShine}
            onFacingChange={setFacing}
          />
        )}

        {!pokemon && !loading && !error && (
          <p className="text-center text-slate-400 mt-8">
            Search for a Pokémon to get started.
          </p>
        )}
      </div>
    </main>
  );
}