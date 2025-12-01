import { MainClient } from "pokenode-ts";
import { PokemonSpeciesDexEntry, Berry } from "pokenode-ts";

export interface Pokemon {
  name: string;
  url: string;
  id: number;
  image: string;
  sprites?: any;
  abilities?: any;
  stats?: any;
  types: PokemonTypes[];
  species: Species;
}

export interface Pokedex {
  id: number;
  /** The name for this resource */
  name: string;
  is_main_series: boolean;
  /** The description of this resource listed in different languages */
  descriptions: Description[];
  /** The name of this resource listed in different languages */
  names: Name[];
  pokemon_entries: PokemonEntry[];
  region: NamedAPIResource;
  /** A list of version groups this Pokédex is relevant to */
  version_groups: NamedAPIResource[];
}

export interface PokemonEntry {
  /** The index of this Pokémon species entry within the Pokédex */
  entry_number: number;
  /** The Pokémon species being encountered */
  pokemon_species: NamedAPIResource;
}

export interface Description {
  /** The localized description for an API resource in a specific language. */
  description: string;
  /** The language this name is in */
  language: NamedAPIResource;
}

interface Species {
  name: string;
  url: string;
}

export interface Name {
  /** The localized name for an API resource in a specific language */
  name: string;
  /** The language this name is in */
  language: NamedAPIResource;
}

export interface NamedAPIResource {
  /** The name of the referenced resource */
  name: string;
  /** The URL of the referenced resource */
  url: string;
}

export interface PokemonTypes {
  slot: number;
  type: Type;
}

interface Type {
  name: string;
  url: string;
}

interface TypeInfo {
  sprites: Generation;
}

export interface Generation {
  /** The identifier for this resource */
  id: number;
  /** The name for this resource */
  name: string;
  /** A list of abilities that were introduced in this generation */
  abilities: NamedAPIResource[];
  /** The name of this resource listed in different languages */
  names: Name[];
  /** The main region travelled in this generation */
  main_region: NamedAPIResource;
  /** A list of moves that were introduced in this generation */
  moves: NamedAPIResource[];
  /** A list of Pokémon species that were introduced in this generation */
  pokemon_species: NamedAPIResource[];
  /** A list of types that were introduced in this generation */
  types: NamedAPIResource[];
  /** A list of version groups that were introduced in this generation */
  version_groups: NamedAPIResource[];
}

type Item = {
  name: string;
  url: string;
};

export interface Chain {
  is_baby: boolean;
  species: Species;
  evolution_details: EvolutionDetails[];
  evolves_to: Chain[];
}

export interface EvolutionDetails {
  gender: number;
  held_item: null;
  item: Item;
  known_move: null;
  known_move_type: null;
  location: null;
  min_affection: null;
  min_beauty: null;
  min_happiness: number;
  min_level: number;
  needs_overworld_rain: boolean;
  party_species: null;
  party_type: null;
  relative_physical_stats: null;
  time_of_day: string;
  trade_species: null;
  trigger: Trigger;
  turn_upside_down: boolean;
  evolves_to?: EvolutionDetails;
  Image: string;
}

interface Trigger {
  name: string;
  url: string;
}

const pokeApi = () => {
  const api = new MainClient();

  const getPokemon = async (): Promise<PokemonEntry[]> => {
    const data = await api.game.getPokedexById(1);
    return data.pokemon_entries.map((item: PokemonEntry) => ({
      ...item,
      id: item.entry_number,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.entry_number}.png`,
    }));};

  const getPokemonDetails = async (id: string): Promise<Pokemon> => {
    const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await resp.json();
    return data;
  };

  const getPokemonType = async (typeUrl: string): Promise<TypeInfo> => {
    const resp = await fetch(typeUrl);
    const data = await resp.json();
    return data;
  };

  const getAllPokemonFromGen = async (gen: number): Promise<NamedAPIResource[]> => {
    const data = await api.game.getGenerationById(gen);
    console.log("generation: ", gen);
    console.log("data: ", data);
    return data.pokemon_species
      .map((item: NamedAPIResource, index: number) => {
        return {
          ...item,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
            index + 1
          }.png`,
        };
      })
      .sort((a: any, b: any) => (a.index ?? 0) - (b.index ?? 0));;
  };

  const getEvolutions = async (id: string) => {
    const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await resp.json();
    const speciesResp = await fetch(data.species.url);
    const speciesData = await speciesResp.json();
    const evoResp = await fetch(speciesData.evolution_chain.url);
    const evoData = await evoResp.json();
    return evoData;
  };

  return {
    getPokemon,
    getPokemonDetails,
    getPokemonType,
    getAllPokemonFromGen,
    getEvolutions,
  };
};

export default pokeApi;
