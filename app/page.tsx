"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "./components/Sidebar"
import { PanelLayout } from "./components/PokemonDisplay"
import { fetchPokemon } from "@/lib/pokeapi"
import type { Pokemon } from "@/types/pokemon"
import { buildFormQuery } from "@/lib/buildFormQuery"
import type { PokemonForm } from "@/types/forms"
import build from "next/dist/build"


export type Variant = "normal" | "shiny"


export default function Home() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [variant, setVariant] = useState<Variant>("normal")
  const [form, setForm] = useState<PokemonForm>("normal")
  const [baseName, setBaseName] = useState<string>("")
  const [availableForms, setAvailableForms] = useState<PokemonForm[]>(["normal"])
  

  async function handleSearch(query: string) {
  try {
    setError(null)
    setBaseName(query.toLowerCase())

    const finalQuery = buildFormQuery(query, form) // <— form comes from your state
    const data = await fetchPokemon(finalQuery)
    setPokemon(data)

    const forms: PokemonForm[] = ["normal"]
    const testForms: PokemonForm[] = ["alola", "galar", "hisui", "paldea", "mega", "gmax"]

    for (const f of testForms) {
      const q = buildFormQuery(query, f)
      const req = await fetch(`https://pokeapi.co/api/v2/pokemon/${q}`)
        if (req.ok) forms.push(f)
    }
    setAvailableForms(forms)

  } catch {
    setError("Pokémon not found")
  }
}

  useEffect(() => {
    if (!baseName) return
      handleSearch(baseName)
    }, [form])

  return (
    <main className="h-screen grid grid-cols-[280px_1fr] gap-6 p-6">
      <aside className="glass rounded-xl p-4">
        <Sidebar    
        onSearch={handleSearch}
        variant={variant}
        onVariantChange={setVariant}
        form={form}
        onFormChange={setForm}
        availableForms={availableForms}
        />
      </aside>

      <section className="glass rounded-xl p-6">
        <PanelLayout variant={variant} pokemon={pokemon} error={error} />
      </section>
    </main>
  )
}
