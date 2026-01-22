export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonSprites {
  front_default: string | null;
  back_default: string | null;
  front_shiny: string | null;
  back_shiny: string | null;
  front_female: string | null;
  back_female: string | null;
  front_shiny_female: string | null;
  back_shiny_female: string | null;
}

export interface Pokemon {
  id: number;
  name: string;
  stats: PokemonStat[];
  sprites: PokemonSprites;
  species: {
    name: string;
    url: string;
  };
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
}

