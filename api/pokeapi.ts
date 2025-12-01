import { MainClient } from "pokenode-ts";
import {
  Pokemon,
  PokemonEntry,
  TypeInfo,
  NamedAPIResource,
  PokemonSpecies,
} from "@/interface";

const pokeApi = () => {
  const api = new MainClient();

  const getPokemon = async (): Promise<Pokemon[]> => {
    const data = await api.game.getPokedexById(1);
    return data.pokemon_entries.map((item: Pokemon) => ({
      ...item,
      id: item.entry_number,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.entry_number}.png`,
    }));
  };

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

  const getAllPokemonFromGen = async (
    gen: number
  ): Promise<PokemonSpecies[]> => {
    const data = await api.game.getGenerationById(gen);
    const species = await Promise.all(
      data.pokemon_species.map(async (res) => {
        return api.pokemon.getPokemonSpeciesByName(res.name);
      })
    );
    return species.map((item) => {
      return {
        ...item,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png`,
      };
    }).sort((a, b) => a.id - b.id);
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
