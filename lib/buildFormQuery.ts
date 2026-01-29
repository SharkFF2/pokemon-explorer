import type { PokemonForm } from "@/types/forms"



export function buildFormQuery(name: string, form: PokemonForm) {
  const base = name.toLowerCase()

  

  switch (form) {
    case "alola":
      return `${base}-alola`
    case "galar":
      return `${base}-galar`
    case "hisui":
      return `${base}-hisui`
    case "paldea":
      return `${base}-paldea`
    case "mega":
      return `${base}-mega`
    case "gmax":
      return `${base}-gmax`
    default:
      return base
  }
}
