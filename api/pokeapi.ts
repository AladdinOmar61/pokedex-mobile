import { useEffect, useState } from "react";

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

interface Species {
  name: string;
  url: string;
}

export interface GenPokemonEntry {
  name: string;
  url: string;
  image: string;
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
  gameName: GameName;
}

interface GameName {
  nameIcon: string;
}

export interface Chain {
  is_baby: boolean;
  species: Species;
  evolution_details: EvolutionDetails[];
  evolves_to: Chain;
}

export interface EvolutionDetails {
  gender: number;
  held_item: null;
  item: null;
  known_move: null;
  known_move_type: null;
  location: null;
  min_affection: null;
  min_beauty: null;
  min_happiness: null;
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
}

interface Trigger {
  name: string;
  url: string;
}

const pokeApi = () => {
  let pokemonData: Pokemon = { name: "", url: "", image: "", id: 0, types: [], species: {name: "", url: ""} };

  // All Pokemon

  const getPokemon = async (limit = -1): Promise<Pokemon[]> => {
    const resp = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}`
    );
    const data = await resp.json();
    return data.results.map((item: Pokemon, index: number) => ({
      ...item,
      id: index + 1,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
        index + 1
      }.png`,
    }));
  };

  const getPokemonDetails = async (id: string): Promise<Pokemon> => {
    const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await resp.json();
    // pokemonData = data;
    // console.log("pokemon data from getPokemonDetails:", pokemonData);
    return data;
  };

  const getPokemonType = async (typeUrl: string): Promise<TypeInfo> => {
    const resp = await fetch(typeUrl);
    const data = await resp.json();
    return data;
  };

  const getAllPokemonFromGen = async (
    gen: string
  ): Promise<GenPokemonEntry[]> => {
    const resp = await fetch(`https://pokeapi.co/api/v2/generation/${gen}`);
    const data = await resp.json();
    return data.pokemon_species
      .map((item: GenPokemonEntry) => {
        const extractedNum = item.url.match(/\/(\d+)\/$/);
        const finalNum = extractedNum ? extractedNum[1] : null;
        return {
          ...item,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${finalNum}.png`,
          num: finalNum,
        };
      })
      .sort((a: any, b: any) => (a.num ?? 0) - (b.num ?? 0));
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

  const getPokemonSpecies = async (url: string) => {
    const resp = await fetch(url);
    const data = await resp.json();
  }

  return {
    getPokemon,
    getPokemonDetails,
    getPokemonType,
    getAllPokemonFromGen,
    getEvolutions,
  };
};

export default pokeApi;
