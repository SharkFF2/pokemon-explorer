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
import { FilterPanel, type FilterOptions } from "./components/FilterPanel";
import { PokemonListView } from "./components/PokemonListView";

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
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [showListView, setShowListView] = useState(false);

  // Region to ID range mapping
  const regionRanges: Record<string, [number, number]> = {
    kanto: [1, 151],
    johto: [152, 251],
    hoenn: [252, 386],
    sinnoh: [387, 493],
    unova: [494, 649],
    kalos: [650, 721],
    alola: [722, 809],
    galar: [810, 905],
    paldea: [906, 1025],
  };

  // Memoize rarity sets for O(1) lookups
  const raritySets = useMemo(() => ({
    mythical: new Set(MYTHICAL_LIST),
    ultra: new Set(ULTRA_BEAST_LIST),
    legendary: new Set(LEGENDARY_LIST),
  }), []);

  // Build rarity map for filtered results
  const buildRarityMap = useCallback((pokemonList: Pokemon[]) => {
    const map: Record<number, Rarity> = {};
    pokemonList.forEach((p) => {
      if (raritySets.mythical.has(p.id)) {
        map[p.id] = "mythical";
      } else if (raritySets.ultra.has(p.id)) {
        map[p.id] = "ultra";
      } else if (raritySets.legendary.has(p.id)) {
        map[p.id] = "legendary";
      } else {
        map[p.id] = "normal";
      }
    });
    return map;
  }, [raritySets]);

  // Apply filters and fetch Pokemon
  const applyFilters = useCallback(async (filters: FilterOptions) => {
    setLoading(true);
    setError(null);
    setShowFilterPanel(false);

    try {
      const results: Pokemon[] = [];

      // Determine ID range based on generation
      let minId = 1;
      let maxId = 1025;

      if (filters.gen !== "all") {
        const genNum = parseInt(filters.gen);
        const ranges = [
          [1, 151],    // Gen 1
          [152, 251],  // Gen 2
          [252, 386],  // Gen 3
          [387, 493],  // Gen 4
          [494, 649],  // Gen 5
          [650, 721],  // Gen 6
          [722, 809],  // Gen 7
          [810, 905],  // Gen 8
          [906, 1025], // Gen 9
        ];
        [minId, maxId] = ranges[genNum - 1];
      }

      // Fetch Pokemon in the range
      for (let id = minId; id <= maxId; id++) {
        try {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
          if (!res.ok) continue;

          const data: Pokemon = await res.json();

          // Check rarity filter
          let pokemonRarity: Rarity = "normal";
          if (raritySets.mythical.has(data.id)) {
            pokemonRarity = "mythical";
          } else if (raritySets.ultra.has(data.id)) {
            pokemonRarity = "ultra";
          } else if (raritySets.legendary.has(data.id)) {
            pokemonRarity = "legendary";
          }

          if (
            filters.rarity !== "all" &&
            pokemonRarity !== filters.rarity
          ) {
            continue;
          }

          // Check type filter
          const pokemonTypes = data.types.map((t) => t.type.name);

          if (filters.types.length > 0) {
            const hasAllTypes = filters.types.every((type) =>
              pokemonTypes.includes(type)
            );
            if (!hasAllTypes) continue;
          }

          results.push(data);
        } catch {
          // Skip if error fetching individual Pokemon
          continue;
        }
      }

      setFilteredPokemon(results);
      setShowListView(true);
    } catch (err: any) {
      setError(err.message || "Failed to apply filters");
    } finally {
      setLoading(false);
    }
  }, [raritySets]);

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
          onFilter={() => setShowFilterPanel(true)}
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

      {showFilterPanel && (
        <FilterPanel
          onApplyFilter={applyFilters}
          onClose={() => setShowFilterPanel(false)}
        />
      )}

      {showListView && (
        <PokemonListView
          pokemon={filteredPokemon}
          loading={loading}
          rarityMap={buildRarityMap(filteredPokemon)}
          onClose={() => setShowListView(false)}
        />
      )}
    </main>
  );
}