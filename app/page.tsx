"use client";

import { useState, FormEvent, KeyboardEvent, useEffect } from "react";
import type { Pokemon } from "../types/pokemon";

type Gender = "male" | "female";
type Shine = "normal" | "shiny";
type Facing = "front" | "back";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [gender, setGender] = useState<Gender>("male");
  const [shine, setShine] = useState<Shine>("normal");
  const [facing, setFacing] = useState<Facing>("front");
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState<string | null>(null);
// Mythical Pokémon list
  const mythicalList = [
    151, 251, 385, 386, 489, 490, 491, 492, 493,
    494, 647, 648, 649, 719, 720, 721, 801, 802,
    807, 808, 809, 893, 902, 1008, 1024, 1025
  ];

  // Ultra Beasts
  const ultraBeastList = [
    793, 794, 795, 796, 797, 798, 799,
    803, 804, 805, 806
  ];

  const legendaryList = [
  // Gen 1
  144, 145, 146, 150,

  // Gen 2
  243, 244, 245, 249, 250,

  // Gen 3
  377, 378, 379, 380, 381, 382, 383, 384,

  // Gen 4
  480, 481, 482, 483, 484, 485, 486, 487, 488,

  // Gen 5
  638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649,

  // Gen 6
  716, 717, 718,

  // Gen 7
  785, 786, 787, 788, // Tapus
  789, 790, 791, 792, // Cosmog line
  800,                // Necrozma

  // Gen 8
  888, 889, 890,      // Zacian, Zamazenta, Eternatus
  894, 895, 896, 897, // Regieleki, Regidrago, Glastrier, Spectrier
  898,                // Calyrex

  // Gen 9
  1001, 1002, 1003, 1004, // Treasures of Ruin
  1007, 1008,             // Koraidon, Miraidon
  1020, 1021, 1022, 1023, // Paradox legendaries
  1024, 1025              // Terapagos, Pecharunt
];


  function weightedChance(probability: number) {
    return Math.random() < probability;
  }

  const handleSearch = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setPokemon(null);

    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase().trim()}`
      );
      if (!res.ok) {
        throw new Error("Pokémon not found");
      }
      const data: Pokemon = await res.json();
      setPokemon(data);

      setGender("male");
      setShine("normal");
      setFacing("front");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // RANDOM POKÉMON GENERATOR
  const getRandomPokemon = async () => {
    setLoading(true);
    setError(null);

    try {
      let id = Math.floor(Math.random() * 1025) + 1;

      // Mythical rarity (0.5%)
      if (weightedChance(0.005)) {
        id = mythicalList[Math.floor(Math.random() * mythicalList.length)];
      }

      // Ultra Beast rarity (1%)
      else if (weightedChance(0.01)) {
        id = ultraBeastList[Math.floor(Math.random() * ultraBeastList.length)];
      }

      // Legendary rarity (1%)
      else if (weightedChance(0.01)) {
        id = legendaryList[Math.floor(Math.random() * legendaryList.length)];
      }

      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data: Pokemon = await res.json();
      setPokemon(data);

      // Female rarity (10%)
      const femaleRoll = weightedChance(0.1);
      if (femaleRoll && data.sprites.front_female) {
        setGender("female");
      } else {
        setGender("male");
      }

      // Shiny rarity (1/200)
      const shinyRoll = weightedChance(1 / 200);
      if (shinyRoll) {
        setShine("shiny");
      } else {
        setShine("normal");
      }

      // Always face forward
      setFacing("front");

      // Toast notifications
      if (mythicalList.includes(data.id)) {
        setToast("🌸 You found a MYTHICAL Pokémon!");
      } else if (ultraBeastList.includes(data.id)) {
        setToast("🔥 You found an ULTRA BEAST!");
      } else if (legendaryList.includes(data.id)) {
        setToast("✨ You found a LEGENDARY Pokémon!");
      } else if (shinyRoll) {
        setToast("⭐ You found a SHINY Pokémon!");
      }


    } catch (err) {
      setError("Failed to load random Pokémon");
    } finally {
      setLoading(false);
    }
  };

  // Auto-hide toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      void handleSearch();
    }
  };

  const getCurrentSprite = () => {
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
  };

  const spriteUrl = getCurrentSprite();

  // Variant detection
  const hasFemale =
    pokemon?.sprites.front_female !== null ||
    pokemon?.sprites.back_female !== null ||
    pokemon?.sprites.front_shiny_female !== null ||
    pokemon?.sprites.back_shiny_female !== null;

  const hasShiny =
    pokemon?.sprites.front_shiny !== null ||
    pokemon?.sprites.back_shiny !== null ||
    pokemon?.sprites.front_shiny_female !== null ||
    pokemon?.sprites.back_shiny_female !== null;

  useEffect(() => {
    if (!pokemon) return;

    if (!hasFemale && gender === "female") {
      setGender("male");
    }

    if (!hasShiny && shine === "shiny") {
      setShine("normal");
    }
  }, [pokemon]);

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">

      {/* Toast popup */}
      {toast && (
        <div className="fixed top-4 right-4 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg border border-slate-600 animate-pulse">
          {toast}
        </div>
      )}

      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Pokémon Viewer</h1>

        <form
          onSubmit={handleSearch}
          className="flex gap-2 mb-6 justify-center"
        >
          <input
            type="text"
            placeholder="Search by name or ID (e.g. pikachu, 25)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-slate-900 hover:bg-emerald-400 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Search"}
          </button>

          <button
            type="button"
            onClick={getRandomPokemon}
            className="rounded-lg bg-purple-500 px-4 py-2 font-semibold text-slate-900 hover:bg-purple-400"
          >
            Random
          </button>
        </form>

        {error && (
          <p className="text-center text-red-400 mb-4 font-medium">{error}</p>
        )}

        {pokemon && (
          <div className="relative flex flex-col md:flex-row gap-6 bg-slate-800 rounded-xl shadow-xl p-6">

            {/* Side variant buttons */}
            <div className="absolute -left-16 top-1/2 -translate-y-1/2 flex flex-col gap-2">

              {hasFemale && (
                <>
                  <button
                    onClick={() => setGender("male")}
                    className={`px-3 py-1 rounded-l-full border border-slate-700 text-xs font-semibold ${
                      gender === "male"
                        ? "bg-blue-500 text-slate-900"
                        : "hover:bg-slate-700"
                    }`}
                  >
                    Male
                  </button>

                  <button
                    onClick={() => setGender("female")}
                    className={`px-3 py-1 rounded-l-full border border-slate-700 text-xs font-semibold ${
                      gender === "female"
                        ? "bg-pink-500 text-slate-900"
                        : "hover:bg-slate-700"
                    }`}
                  >
                    Female
                  </button>
                </>
              )}

              {hasShiny && (
                <>
                  <button
                    onClick={() => setShine("normal")}
                    className={`px-3 py-1 rounded-l-full border border-slate-700 text-xs font-semibold ${
                      shine === "normal"
                        ? "bg-amber-400 text-slate-900"
                        : "hover:bg-slate-700"
                    }`}
                  >
                    Normal
                  </button>

                  <button
                    onClick={() => setShine("shiny")}
                    className={`px-3 py-1 rounded-l-full border border-slate-700 bg-slate-900 text-xs font-semibold ${
                      shine === "shiny"
                        ? "bg-yellow-300 text-slate-900"
                        : "hover:bg-slate-700"
                    }`}
                  >
                    Shiny
                  </button>
                </>
              )}
            </div>

            {/* Sprite + orientation */}
            <div className="flex-1 flex flex-col items-center gap-4">

              {/* Sprite container with rarity glow */}
              <div
                className={`
                  w-48 h-48 rounded-xl flex items-center justify-center border
                  ${
                    mythicalList.includes(pokemon.id)
                      ? "border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.7)] bg-slate-900"
                    : ultraBeastList.includes(pokemon.id)
                      ? "border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.7)] bg-slate-900"
                    : legendaryList.includes(pokemon.id)
                      ? "border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.7)] bg-slate-900"
                    : shine === 'shiny'
                      ? "border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.7)] bg-slate-900"
                    : "border-slate-700 bg-slate-900"
                  }
                `}
              >

                {spriteUrl ? (
                  <img
                    src={spriteUrl}
                    alt={pokemon.name}
                    className="w-40 h-40 object-contain image-rendering-pixelated"
                  />
                ) : (
                  <span className="text-sm text-slate-400">
                    No sprite available
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setFacing("front")}
                  className={`px-3 py-1 rounded-md text-xs font-semibold border border-slate-700 ${
                    facing === "front"
                      ? "bg-emerald-500 text-slate-900"
                      : "bg-slate-900 hover:bg-slate-700"
                  }`}
                >
                  Front
                </button>
                <button
                  onClick={() => setFacing("back")}
                  className={`px-3 py-1 rounded-md text-xs font-semibold border border-slate-700 ${
                    facing === "back"
                      ? "bg-emerald-500 text-slate-900"
                      : "bg-slate-900 hover:bg-slate-700"
                  }`}
                >
                  Back
                </button>
              </div>

              <p className="text-sm text-slate-400">
                Viewing:{" "}
                <span className="font-semibold text-slate-100">
                  {gender} / {shine} / {facing}
                </span>
              </p>
            </div>

            {/* Stats + rarity badges */}
            <div className="flex-1">

              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold capitalize">
                  {pokemon.name} <span className="text-slate-400">#{pokemon.id}</span>
                </h2>

                {legendaryList.includes(pokemon.id) && (
                  <span className="px-2 py-1 text-xs font-bold bg-purple-600 text-white rounded-md shadow-md">
                    LEGENDARY
                  </span>
                )}
                {mythicalList.includes(pokemon.id) && (
                  <span className="px-2 py-1 text-xs font-bold bg-pink-600 text-white rounded-md shadow-md">
                    MYTHICAL
                  </span>
                )}

                {ultraBeastList.includes(pokemon.id) && (
                  <span className="px-2 py-1 text-xs font-bold bg-red-600 text-white rounded-md shadow-md">
                    ULTRA BEAST
                  </span>
                )}

                {shine === "shiny" && (
                  <span className="px-2 py-1 text-xs font-bold bg-yellow-400 text-slate-900 rounded-md shadow-md">
                    SHINY
                  </span>
                )}
              </div>

              <h3 className="text-lg font-semibold mb-2">Base Stats</h3>
              <ul className="space-y-1">
                {pokemon.stats.map((s) => (
                  <li
                    key={s.stat.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="capitalize">{s.stat.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{s.base_stat}</span>
                      <div className="w-32 h-2 bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500"
                          style={{
                            width: `${Math.min(s.base_stat, 150) / 1.5}%`,
                          }}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
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