import { useState } from "react"
import { Variant } from "../page"
import { FormButton } from "./FormButton"
import {PokemonForm} from "@/types/forms"


type SidebarProps = {
  onSearch: (query: string) => void
  variant: Variant
  onVariantChange?: (v: Variant) => void
  form: PokemonForm
  onFormChange?: (f: PokemonForm) => void
  availableForms: PokemonForm[]

}

export function Sidebar({ 
  variant,
  onVariantChange,
  onSearch,
  form,
  onFormChange,
  availableForms
}: SidebarProps) {

  const [query, setQuery] = useState("")

  function Section({
  title,
  children
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="text-xs uppercase opacity-60 mb-2">
        {title}
      </div>
      {children}
    </div>
  )
}

function Segment({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex rounded-lg glass p-1">
      {children}
    </div>
  )
}

function SegmentButton({
  active,
  onClick,
  children
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 px-4 py-2 rounded-md text-sm transition-all
        ${active
          ? "bg-cyan-500/20 text-cyan-300"
          : "opacity-60 hover:opacity-100"
        }
      `}
    >
      {children}
    </button>
  )
}



  return (
    <div>
      <div className="text-2xl font-bold mb-6">
        Pokédex Viewer
      </div>
    <div className="flex flex-col gap-4">

      {/* Search */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="glass rounded-lg px-4 py-2 bg-transparent outline-none"
        placeholder="Search by name or ID"
      />

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onSearch(query)}
          className="glass px-4 py-2 rounded-lg"
        >
          Search
        </button>

        <button
          onClick={() => onSearch(String(Math.floor(Math.random() * 1010) + 1))}
          className="glass px-4 py-2 rounded-lg"
        >
          Random
        </button>
      </div>

      {/* Variant */}
      <Section title="Variant">
        <Segment>
          <SegmentButton
            active={variant === "normal"}
            onClick={() => onVariantChange?.("normal")}
          >
            Normal
          </SegmentButton>
          <SegmentButton
            active={variant === "shiny"}
            onClick={() => onVariantChange?.("shiny")}
          >
            ✨ Shiny
          </SegmentButton>
        </Segment>
      </Section>

      {/* Forms */}
      <Section title="Form">
        <Segment>
          <SegmentButton
            active={form === "normal"}
            onClick={() => onFormChange?.("normal")}
          >
            Original
          </SegmentButton>
        </Segment>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <FormButton 
            active={form === "alola"} 
            disabled={!availableForms.includes("alola")}
          onClick={() => 
          onFormChange?.("alola")}>
            Alolan
          </FormButton>
          <FormButton
            active={form === "galar"}
            disabled={!availableForms.includes("galar")}
            onClick={() => onFormChange?.("galar")}
            icon="/icons/galar.svg"
          >
            Galarian
          </FormButton>

          <FormButton
            active={form === "hisui"}
            disabled={!availableForms.includes("hisui")}
            onClick={() => onFormChange?.("hisui")}
            icon="/icons/hisui.svg"
          >
            Hisuian
          </FormButton>

          <FormButton
            active={form === "paldea"}
            disabled={!availableForms.includes("paldea")}
            onClick={() => onFormChange?.("paldea")}
            icon="/icons/paldea.svg"
          >
  Paldean
</FormButton>

        </div>
      </Section>
    </div>
  </div>
  )
}