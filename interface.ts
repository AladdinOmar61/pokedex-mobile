export interface Pokemon {
  id: number;
  name: string;
  // image?: string;
  base_experience: number;
  height: number;
  is_default: boolean;
  order: number;
  weight: number;
  abilities: PokemonAbility[];
  forms: NamedAPIResource[];
  game_indices: VersionGameIndex[];
  held_items: PokemonHeldItem[];
  location_area_encounters: string;
  moves: PokemonMove[];
  sprites: PokemonSprites;
  species: NamedAPIResource;
  stats: PokemonStat[];
  types: PokemonType[];
}

export interface VersionGameIndex {
  /** The internal id of an API resource within game data */
  game_index: number;
  /** The version relevent to this game index */
  version: NamedAPIResource;
}

export interface PokemonHeldItem {
  /** The item the referenced Pokémon holds */
  item: NamedAPIResource;
  /** The details of the different versions in which the item is held */
  version_details: PokemonHeldItemVersion[];
}

export interface PokemonHeldItemVersion {
  /** The version in which the item is held */
  version: NamedAPIResource;
  /** How often the item is held */
  rarity: number;
}

export interface PokemonMove {
  /** The move the Pokémon can learn */
  move: NamedAPIResource;
  /** The details of the version in which the Pokémon can learn the move */
  version_group_details: PokemonMoveVersion[];
}

export interface PokemonMoveVersion {
  /** The method by which the move is learned */
  move_learn_method: NamedAPIResource;
  /** The version group in which the move is learned */
  version_group: NamedAPIResource;
  /** The minimum level to learn the move */
  level_learned_at: number;
}

export interface PokemonAbility {
  /** Whether or not this is a hidden ability */
  is_hidden: boolean;
  /** The slot this ability occupies in this Pokémon species */
  slot: number;
  /** The ability the Pokémon may have */
  ability: NamedAPIResource;
}

export interface PokemonStat {
  stat: NamedAPIResource;
  effort: number;
  base_stat: number;
}

export interface PokemonSprites {
  /** The default depiction of this Pokémon from the front in battle */
  front_default: string | null;
  /** The shiny depiction of this Pokémon from the front in battle */
  front_shiny: string | null;
  /** The female depiction of this Pokémon from the front in battle */
  front_female: string | null;
  /** The shiny female depiction of this Pokémon from the front in battle */
  front_shiny_female: string | null;
  /** The default depiction of this Pokémon from the back in battle */
  back_default: string | null;
  /** The shiny depiction of this Pokémon from the back in battle */
  back_shiny: string | null;
  /** The female depiction of this Pokémon from the back in battle */
  back_female: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle */
  back_shiny_female: string | null;
}

export interface PokemonType {
  slot: number;
  type: NamedAPIResource;
}

export interface PokemonEntry {
  /** The index of this Pokémon species entry within the Pokédex */
  entry_number: number;
  /** The Pokémon species being encountered */
  pokemon_species: NamedAPIResource;
}

export interface TypeInfo {
  sprites: Generation;
}

export interface NamedAPIResource {
  /** The name of the referenced resource */
  name: string;
  /** The URL of the referenced resource */
  url: string;
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

export interface Description {
  /** The localized description for an API resource in a specific language. */
  description: string;
  /** The language this name is in */
  language: NamedAPIResource;
}
export interface Name {
  /** The localized name for an API resource in a specific language */
  name: string;
  /** The language this name is in */
  language: NamedAPIResource;
}

export interface PokemonTypes {
  slot: number;
  type: Type;
}

interface Type {
  name: string;
  url: string;
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
  pokemon_species: PokemonSpecies[];
  /** A list of types that were introduced in this generation */
  types: NamedAPIResource[];
  /** A list of version groups that were introduced in this generation */
  version_groups: NamedAPIResource[];
}

export type SimpleSpecies = Pick<PokemonSpecies, "id" | "name" | "varieties" | "image">;

export interface PokemonSpecies {
  /** The identifier for this resource */
  id: number;
  /** The name for this resource */
  name: string;
  /** The order in which species should be sorted. Based on National Dex order, except families are grouped together and sorted by stage */
  order: number;
  image: string;
  /** The chance of this Pokémon being female, in eighths; or -1 for genderless */
  gender_rate: number;
  /** The base capture rate; up to 255. The higher the number, the easier the catch */
  capture_rate: number;
  /** The happiness when caught by a normal Pokéball; up to 255. The higher the number, the happier the Pokémon */
  base_happiness: number;
  /** Whether or not this is a baby Pokémon */
  is_baby: boolean;
  /** Whether or not this is a legendary Pokémon */
  is_legendary: boolean;
  /** Whether or not this is a mythical Pokémon */
  is_mythical: boolean;
  /** Initial hatch counter: one must walk 255 × (hatch_counter + 1) steps before this Pokémon's egg hatches, unless utilizing bonuses like Flame Body's */
  hatch_counter: number;
  /** Whether or not this Pokémon has visual gender differences */
  has_gender_differences: boolean;
  /** Whether or not this Pokémon has multiple forms and can switch between them */
  forms_switchable: boolean;
  /** The rate at which this Pokémon species gains levels */
  growth_rate: NamedAPIResource;
  /** A list of Pokedexes and the indexes reserved within them for this Pokémon species */
  //   pokedex_numbers: PokemonSpeciesDexEntry[];
  /** A list of egg groups this Pokémon species is a member of */
  egg_groups: NamedAPIResource[];
  /** The color of this Pokémon for Pokédex search */
  color: NamedAPIResource;
  /** The shape of this Pokémon for Pokédex search */
  shape: NamedAPIResource;
  /** The Pokémon species that evolves into this Pokemon_species */
  evolves_from_species: NamedAPIResource;
  /** The evolution chain this Pokémon species is a member of */
  //   evolution_chain: APIResource;
  /** The habitat this Pokémon species can be encountered in */
  habitat: NamedAPIResource;
  /** The generation this Pokémon species was introduced in */
  generation: NamedAPIResource;
  /** The name of this resource listed in different languages */
  names: Name[];
  /** A list of encounters that can be had with this Pokémon species in pal park */
  //   pal_park_encounters: PalParkEncounterArea[];
  /** A list of flavor text entries for this Pokémon species */
  //   flavor_text_entries: FlavorText[];
  /** Descriptions of different forms Pokémon take on within the Pokémon species */
  form_descriptions: Description[];
  /** The genus of this Pokémon species listed in multiple languages */
  //   genera: Genus[];
  /** A list of the Pokémon that exist within this Pokémon species */
  varieties: PokemonSpeciesVariety[];
}

export interface PokemonSpeciesVariety {
  /** Whether this variety is the default variety */
  is_default: boolean;
  /** The Pokémon variety */
  pokemon: NamedAPIResource;
}

// export interface EvolutionChain {
//   /** The identifier for this resource */
//   id: number;
//   /**
//    * The item that a Pokémon would be holding when mating that would trigger
//    * the egg hatching a baby Pokémon rather than a basic Pokémon
//    */
//   baby_trigger_item: NamedAPIResource | null;
//   /**
//    * The base chain link object. Each link contains evolution details for a Pokémon in the chain.
//    * Each link references the next Pokémon in the natural evolution order
//    */
//   chain: ChainLink;
// }

// export interface ChainLink {
//   /** Whether or not this link is for a baby Pokémon. This would only ever be true on the base link */
//   is_baby: boolean;
//   /** The Pokémon species at this point in the evolution chain */
//   species: NamedAPIResource;
//   /** All details regarding the specific details of the referenced Pokémon species evolution */
//   evolution_detail: EvolutionDetail[];
//   /** A List of chain objects */
//   evolves_to: ChainLink[];
// }

export interface EvolutionDetail {
  item: NamedAPIResource;
  trigger: NamedAPIResource;
  gender: number;
  held_item: NamedAPIResource;
  known_move: NamedAPIResource;
  known_move_type: NamedAPIResource;
  location: NamedAPIResource;
  min_level: number;
  min_happiness: number;
  min_beauty: number;
  min_affection: number;
  needs_overworld_rain: boolean;
  /** The Pokémon species that must be in the players party in order for the evolving Pokémon species to evolve into this Pokémon species. */
  party_species: NamedAPIResource;
  /**
   * The player must have a Pokémon of this type in their party during the evolution trigger event
   * in order for the evolving Pokémon species to evolve into this Pokémon species.
   */
  party_type: NamedAPIResource;
  /** The required relation between the Pokémon's Attack and Defense stats. 1 means Attack > Defense. 0 means Attack = Defense. -1 means Attack < Defense. */
  relative_physical_stats: 1 | 0 | -1;
  /** The required time of day. Day or night. */
  time_of_day: "Day" | "Night";
  /** Pokémon species for which this one must be traded. */
  trade_species: NamedAPIResource;
  /** Whether or not the 3DS needs to be turned upside-down as this Pokémon levels up. */
  turn_upside_down: boolean;
}

export interface EvolutionTrigger {
  /** The identifier for this resource. */
  id: number;
  /** The name for this resource. */
  name: string;
  /** The name of this resource listed in different languages. */
  names: Name[];
  /** A list of pokemon species that result from this evolution trigger. */
  pokemon_species: NamedAPIResource[];
}