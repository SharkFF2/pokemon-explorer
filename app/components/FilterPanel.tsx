import { useState, useEffect } from "react";

interface FilterPanelProps {
  onApplyFilter: (filters: FilterOptions) => void;
  onClose: () => void;
}

export interface FilterOptions {
  types: string[];
  rarity: "all" | "normal" | "legendary" | "ultra" | "mythical";
  gen: "all" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
}

const TYPES = [
  "normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison",
  "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark",
  "steel", "fairy"
];

const REGIONS = [
  { id: "kanto", name: "Kanto (Gen 1)" },
  { id: "johto", name: "Johto (Gen 2)" },
  { id: "hoenn", name: "Hoenn (Gen 3)" },
  { id: "sinnoh", name: "Sinnoh (Gen 4)" },
  { id: "unova", name: "Unova (Gen 5)" },
  { id: "kalos", name: "Kalos (Gen 6)" },
  { id: "alola", name: "Alola (Gen 7)" },
  { id: "galar", name: "Galar (Gen 8)" },
  { id: "paldea", name: "Paldea (Gen 9)" },
];

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
};

export function FilterPanel({ onApplyFilter, onClose }: FilterPanelProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [rarity, setRarity] = useState<"all" | "normal" | "legendary" | "ultra" | "mythical">("all");
  const [gen, setGen] = useState<"all" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9">("all");

  const toggleType = (type: string) => {
    setSelectedTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      }
      if (prev.length < 2) {
        return [...prev, type];
      }
      return prev;
    });
  };

  const handleApply = () => {
    onApplyFilter({
      types: selectedTypes,
      rarity,
      gen,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 border border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-100">Filter Pokémon</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Type Filter */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-300 mb-3">
            Types (Select up to 2)
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {TYPES.map((type) => (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={`py-2 px-3 rounded font-semibold text-sm text-white capitalize transition ${
                  selectedTypes.includes(type)
                    ? `${typeColors[type]} ring-2 ring-white`
                    : "bg-slate-700 hover:bg-slate-600"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Rarity Filter */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-300 mb-3">
            Rarity
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {["all", "normal", "legendary", "ultra", "mythical"].map((r) => (
              <button
                key={r}
                onClick={() => setRarity(r as any)}
                className={`py-2 px-3 rounded font-semibold text-sm capitalize transition ${
                  rarity === r
                    ? "bg-emerald-500 text-slate-900"
                    : "bg-slate-700 text-slate-100 hover:bg-slate-600"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Generation Filter */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-300 mb-3">
            Generation
          </label>
          <div className="grid grid-cols-5 gap-2">
            {["all", "1", "2", "3", "4", "5", "6", "7", "8", "9"].map((g) => (
              <button
                key={g}
                onClick={() => setGen(g as any)}
                className={`py-2 px-3 rounded font-semibold text-sm transition ${
                  gen === g
                    ? "bg-emerald-500 text-slate-900"
                    : "bg-slate-700 text-slate-100 hover:bg-slate-600"
                }`}
              >
                {g === "all" ? "All" : `Gen ${g}`}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-700 text-slate-100 hover:bg-slate-600 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-900 hover:bg-emerald-400 font-semibold"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
