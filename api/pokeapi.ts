import { MainClient } from "pokenode-ts";
import {
  Pokemon,
  TypeInfo,
  SimpleSpecies,
  EvolutionChain,
  ChainLink,
} from "@/interface";
import type { EvolutionChain as PokeEvolutionChain } from "pokenode-ts";

const pokeApi = () => {
  const api = new MainClient();

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

  const getPokemonDetails = async (id: string): Promise<Pokemon> => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    return await safeFetchJson(url);
  };

  const getPokemonType = async (typeUrl: string): Promise<TypeInfo> => {
    return await safeFetchJson(typeUrl);
  };

  const getAllPokemonFromGen = async (
    gen: number
  ): Promise<SimpleSpecies[]> => {
    const data = await api.game.getGenerationById(gen);
    const species = await Promise.all(
      data.pokemon_species.map(async (res) => {
        return api.pokemon.getPokemonSpeciesByName(res.name);
      })
    );
    return species
      .map((item) => ({
        id: item.id,
        name: item.name,
        varieties: item.varieties,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png`,
      }))
      .sort((a, b) => a.id - b.id);
  };

  //pokemon > species > id

  const getEvolutions = async (id: string): Promise<PokeEvolutionChain> => {
    const pokemonUrl = await api.pokemon.getPokemonSpeciesByName(id);
    console.log("pokemon url: ", pokemonUrl);
    const evoData = await api.evolution.getEvolutionChainById(pokemonUrl.id);
    console.log("evolution data: ", evoData);
    return evoData;
  };

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
    getPokemonDetails,
    getPokemonType,
    getAllPokemonFromGen,
    getEvolutions,
  };
};

export default pokeApi;
