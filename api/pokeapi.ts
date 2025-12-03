import { MainClient } from "pokenode-ts";
import {
  Pokemon,
  PokemonEntry,
  TypeInfo,
  NamedAPIResource,
  PokemonSpecies,
  SimpleSpecies,
} from "@/interface";

const pokeApi = () => {
  const api = new MainClient();

  const getPokemon = async (): Promise<Pokemon[]> => {
    const data = await api.game.getPokedexById(1);
    const pokemon = await Promise.all(
      data.pokemon_entries.map(async (res) => {
        // console.log("res", res);
        console.log("pokemon name: ", res.pokemon_species.name);
        return api.pokemon.getPokemonById(res.entry_number);
      })
    );
    console.log("pokemon info ", pokemon);
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
        console.log("res: ", res);
        return api.pokemon.getPokemonSpeciesByName(res.name);
      })
    );
    console.log("species: ", species);
    // console.log(species.varieties);
    return species
      .map((item) => ({
        id: item.id,
        name: item.name,
        varieties: item.varieties,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png`,
      }))
      .sort((a, b) => a.id - b.id);
  };

  const getEvolutions = async (id: string) => {
    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const data = await safeFetchJson(pokemonUrl);
    const speciesData = await safeFetchJson(data.species.url);
    const evoData = await safeFetchJson(speciesData.evolution_chain.url);
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
