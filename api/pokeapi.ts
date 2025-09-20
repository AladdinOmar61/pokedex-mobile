export interface Pokemon {
  name: string;
  url: string;
  id: number;
  image: string;
  sprites?: any;
  abilities?: any;
  stats?: any;
  types: PokemonTypes[];
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

// All Pokemon

export const getPokemon = async (limit = -1): Promise<Pokemon[]> => {
  const resp = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
  const data = await resp.json();
  return data.results.map((item: Pokemon, index: number) => ({
    ...item,
    id: index + 1,
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1
      }.png`,
  }));
};

export const getPokemonDetails = async (id: string): Promise<Pokemon> => {
  const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await resp.json();
  return data;
};

export const getPokemonType = async (typeUrl: string): Promise<TypeInfo> => {
  const resp = await fetch(typeUrl);
  const data = await resp.json();
  return data;
}

export const getAllPokemonFromGen = async (gen: string): Promise<GenPokemonEntry[]> => {
  const resp = await fetch(`https://pokeapi.co/api/v2/generation/${gen}`);
  const data = await resp.json();
  return data.pokemon_species.map(
    (item: GenPokemonEntry) => {
      const extractedNum = item.url.match(/\/(\d+)\/$/);
      const finalNum = extractedNum ? extractedNum[1] : null;
      return {
        ...item,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${finalNum}.png`,
        num: finalNum,
      };
    }).sort((a: any, b: any) => (a.num ?? 0) - (b.num ?? 0));
};