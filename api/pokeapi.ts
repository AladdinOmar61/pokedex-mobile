import { MainClient } from "pokenode-ts";
import {
  TypeInfo,
} from "@/interface";
import pLimit from "p-limit";
import type { Pokemon, EvolutionChain, PokemonSpecies, Generation, PokemonSprites } from "pokenode-ts";

const pokeApi = () => {
  const api = new MainClient();

  const limit = pLimit(8);

  const extractedIdFromUrl = (url: string) => {
    const urlId = url.match(/\/(\d+)\/?$/);
    return urlId ? Number(urlId[1]) : null;
  }

  const getAllPokemonFromGen = async (gen: number): Promise<Pokemon[]> => {
    const genData = await api.game.getGenerationById(gen);
    const getPokemonFromGen = await Promise.all(
      genData.pokemon_species.map(async (res) => {
        return api.pokemon.getPokemonById(extractedIdFromUrl(res.url)!);
      })
    )
    return getPokemonFromGen;
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

  const getPokemonDetails = async (name: string): Promise<Pokemon> => {
    return await api.pokemon.getPokemonByName(name);
  }

  const getDefaultSprite = async (name: string): Promise<string> => {
    const pokemonDetails = await api.pokemon.getPokemonByName(name);
    return pokemonDetails.sprites.front_default!;
  };

  const getPokemonType = async (typeUrl: string): Promise<TypeInfo> => {
    return await safeFetchJson(typeUrl);
  };

  const getEvolutions = async (id: number): Promise<EvolutionChain> => {
    const pokemonUrl = await api.pokemon.getPokemonSpeciesById(id);
    let evolutionId = extractedIdFromUrl(pokemonUrl.evolution_chain.url);
    const evoData = await api.evolution.getEvolutionChainById(evolutionId!);
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
    getDefaultSprite,
    getPokemonType,
    getAllPokemonFromGen,
    getEvolutions,
    extractedIdFromUrl,
    getPokemonDetails,
  };
};

export default pokeApi;
