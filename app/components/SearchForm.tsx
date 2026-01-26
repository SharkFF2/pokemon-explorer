import { FormEvent, KeyboardEvent } from "react";

interface SearchFormProps {
  query: string;
  loading: boolean;
  onQueryChange: (query: string) => void;
  onSearch: (e?: FormEvent) => void;
  onRandom: () => void;
  onFilter: () => void;
}

export function SearchForm({ query, loading, onQueryChange, onSearch, onRandom, onFilter }: SearchFormProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch();
    }
  };

  return (
    <form onSubmit={onSearch} className="flex gap-2 mb-6 justify-center flex-wrap">
      <input
        type="text"
        placeholder="Search by name or ID (e.g. pikachu, 25)"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
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
        onClick={onRandom}
        className="rounded-lg bg-purple-500 px-4 py-2 font-semibold text-slate-900 hover:bg-purple-400"
      >
        Random
      </button>
      <button
        type="button"
        onClick={onFilter}
        className="rounded-lg bg-blue-500 px-4 py-2 font-semibold text-slate-900 hover:bg-blue-400"
      >
        Filter
      </button>
    </form>
  );
}