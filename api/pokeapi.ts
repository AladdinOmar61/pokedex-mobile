import { MainClient } from "pokenode-ts";
import {
  TypeInfo,
} from "@/interface";
import pLimit from "p-limit";
import type { Pokemon, EvolutionChain, PokemonSpecies, Generation, PokemonSprites, NamedAPIResource } from "pokenode-ts";

type SinglePokemon = {
  id: number;
  name: string;
  defaultSprite: string;
  primaryType: string;
}

interface PokemonDetails {
  id: number;
  name: string;
  // base_experience: number;
  // height: number;
  is_default: boolean;
  // order: number;
  // weight: number;
  abilities: Ability2[];
  forms: Ability[];
  // game_indices: Gameindex[];
  // held_items: Helditem[];
  // location_area_encounters: string;
  // moves: Move[];
  species: Ability;
  sprites: PokemonSprites;
  // cries: Cries;
  stats: Stat[];
  types: Type[];
  // past_types: Pasttype[];
  // past_abilities: Pastability[];
}

interface Pastability {
  generation: Ability;
  abilities: Ability3[];
}

interface Ability3 {
  ability: null;
  is_hidden: boolean;
  slot: number;
}

interface Pasttype {
  generation: Ability;
  types: Type[];
}

interface Type {
  slot: number;
  type: Ability;
}

interface Stat {
  base_stat: number;
  effort: number;
  stat: Ability;
}

interface Cries {
  latest: string;
  legacy: string;
}

interface Sprites {
  back_default: string;
  back_female: null;
  back_shiny: string;
  back_shiny_female: null;
  front_default: string;
  front_female: null;
  front_shiny: string;
  front_shiny_female: null;
  other: Other;
  versions: Versions;
}

interface Versions {
  'generation-i': Generationi;
  'generation-ii': Generationii;
  'generation-iii': Generationiii;
  'generation-iv': Generationiv;
  'generation-v': Generationv;
  'generation-vi': Generationvi;
  'generation-vii': Generationvii;
  'generation-viii': Generationviii;
}

interface Generationviii {
  icons: Dreamworld;
}

interface Generationvii {
  icons: Dreamworld;
  'ultra-sun-ultra-moon': Home;
}

interface Generationvi {
  'omegaruby-alphasapphire': Home;
  'x-y': Home;
}

interface Generationv {
  'black-white': Blackwhite;
}

interface Blackwhite {
  animated: Showdown;
  back_default: string;
  back_female: null;
  back_shiny: string;
  back_shiny_female: null;
  front_default: string;
  front_female: null;
  front_shiny: string;
  front_shiny_female: null;
}

interface Generationiv {
  'diamond-pearl': Showdown;
  'heartgold-soulsilver': Showdown;
  platinum: Showdown;
}

interface Generationiii {
  emerald: Officialartwork;
  'firered-leafgreen': Crystal;
  'ruby-sapphire': Crystal;
}

interface Generationii {
  crystal: Crystal;
  gold: Crystal;
  silver: Crystal;
}

interface Crystal {
  back_default: string;
  back_shiny: string;
  front_default: string;
  front_shiny: string;
}

interface Generationi {
  'red-blue': Redblue;
  yellow: Redblue;
}

interface Redblue {
  back_default: string;
  back_gray: string;
  front_default: string;
  front_gray: string;
}

interface Other {
  dream_world: Dreamworld;
  home: Home;
  'official-artwork': Officialartwork;
  showdown: Showdown;
}

interface Showdown {
  back_default: string;
  back_female: null;
  back_shiny: string;
  back_shiny_female: null;
  front_default: string;
  front_female: null;
  front_shiny: string;
  front_shiny_female: null;
}

interface Officialartwork {
  front_default: string;
  front_shiny: string;
}

interface Home {
  front_default: string;
  front_female: null;
  front_shiny: string;
  front_shiny_female: null;
}

interface Dreamworld {
  front_default: string;
  front_female: null;
}

interface Move {
  move: Ability;
  version_group_details: Versiongroupdetail[];
}

interface Versiongroupdetail {
  level_learned_at: number;
  version_group: Ability;
  move_learn_method: Ability;
  order: number;
}

interface Helditem {
  item: Ability;
  version_details: Versiondetail[];
}

interface Versiondetail {
  rarity: number;
  version: Ability;
}

interface Gameindex {
  game_index: number;
  version: Ability;
}

interface Ability2 {
  is_hidden: boolean;
  slot: number;
  ability: Ability;
}

interface Ability {
  name: string;
  url: string;
}

const pokeApi = () => {
  const api = new MainClient();

  const limit = pLimit(8);

  const extractedIdFromUrl = (url: string) => {
    const urlId = url.match(/\/(\d+)\/?$/);
    return urlId ? Number(urlId[1]) : null;
  }

  const getAllPokemonFromGen = async (gen: number): Promise<SinglePokemon[]> => {
    const genData = await api.game.getGenerationById(gen);
    const getPokemonFromGen = await Promise.all(
      genData.pokemon_species.map(async (res) => {
        const pokemonSpec = await api.pokemon.getPokemonSpeciesById(
          extractedIdFromUrl(res.url)!
        );
        const pokemon = await api.pokemon.getPokemonById(
          extractedIdFromUrl(res.url)!
        );
        let pokemonName = pokemonSpec.varieties.filter((pkm) => pkm.is_default);
        return {
          id: pokemon.id,
          name: pokemonName[0].pokemon.name,
          primaryType: pokemon.types[0].type.name,
          defaultSprite: pokemon.sprites.front_default!,
        };
      })
    );
    return getPokemonFromGen.sort((a, b) => a.id - b.id);
  };

  const getPokemon = async (): Promise<Pokemon[]> => {
    const data = await api.game.getPokedexById(1);
    const pokemon = await Promise.all(
      data.pokemon_entries.map(async (res) => {
        return api.pokemon.getPokemonById(res.entry_number);
      })
    );
    return pokemon.map((item) => {
      return {
        ...item,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png`,
      };
    });
  };

  const getPokemonDetails = async (name: string): Promise<PokemonDetails> => {
    const detailData = await api.pokemon.getPokemonByName(name);
    return {
      id: detailData.id,
      name:detailData.name,
      is_default: detailData.is_default,
      abilities: detailData.abilities,
      forms: detailData.forms,
      species: detailData.species,
      sprites: detailData.sprites,
      stats: detailData.stats,
      types: detailData.types
    }
  };

  const getDefaultSprite = async (name: string): Promise<string> => {
    const pokemonDetails = await api.pokemon.getPokemonByName(name);
    return pokemonDetails.sprites.front_default!;
  };

  const getPokemonType = async (typeUrl: string): Promise<TypeInfo> => {
    return await safeFetchJson(typeUrl);
  };

  const getEvolutions = async (id: number): Promise<EvolutionChain> => {
    const evoData = await api.evolution.getEvolutionChainById(id!);
      return evoData;
  };

  const getPokemonSpecies = async (name: string): Promise<PokemonSpecies> => {
    const pokemonSpecies = await api.pokemon.getPokemonSpeciesByName(name);
    return pokemonSpecies;
  }

  // Helper that fetches a URL, validates the response, and parses JSON.
  // If the response is not JSON (or returns a non-OK status), it throws
  // a detailed error including the response text to help debugging.
  async function safeFetchJson(url: string): Promise<any> {
    const resp = await fetch(url);
    const text = await resp.text();
    if (!resp.ok) {
      throw new Error(
        `Request to ${url} failed with status ${resp.status} ${resp.statusText}: ${text}`
      );
    }
    try {
      return JSON.parse(text);
    } catch (err: any) {
      // include the beginning of the response text to diagnose non-JSON payloads
      const snippet = text ? text.slice(0, 300) : "<empty response>";
      throw new Error(
        `Failed to parse JSON from ${url}: ${err.message}. Response start: ${snippet}`
      );
    }
  }

  return {
    getPokemon,
    getDefaultSprite,
    getPokemonType,
    getAllPokemonFromGen,
    getEvolutions,
    extractedIdFromUrl,
    getPokemonDetails,
    getPokemonSpecies,
  };
};

export default pokeApi;
