import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import { Generation } from "@/interface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import pokeApi from "@/api/pokeapi";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ArrowRight from "@/assets/Icons/Arrow-Right.svg";
import Heart from "@/assets/Icons/Pixel-Heart.svg";
import { useQuery } from "@tanstack/react-query";
import { PokeBG } from "@/PokeTypes";
import { secondaryTypeColor } from "@/PokeTypeColor";

const Details = () => {
  const { width, height } = useWindowDimensions();

  const {
    getPokemonDetails,
    getPokemonType,
    getEvolutions,
    extractedIdFromUrl,
    getPokemonSpecies,
  } = pokeApi();

  type WidthAndHeight = {
    width: number;
    height: number;
  }

  const { pokemon } = useLocalSearchParams<{ pokemon: string }>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [varietyImgs, setVarietyImgs] = useState<string[]>([]);
  const [varietyIds, setVarietyIds] = useState<number[]>([]);

  const [imgSizes, setImgSizes] = useState<WidthAndHeight[]>([]);
  const [sizesLoading, setSizesLoading] = useState<boolean>(true);

  const [baseEvo, setBaseEvo] = useState<string>("");
  const [evo1Img, setEvo1Img] = useState<string[]>([]);
  const [evo2Img, setEvo2Img] = useState<string[]>([]);

  const [baseNum, setBaseNum] = useState<string>("");
  const [evo1Num, setEvo1Num] = useState<string[]>([]);
  const [evo2Num, setEvo2Num] = useState<string[]>([]);

  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [pokemonType, setPokemonType] = useState<Generation[]>([]);

  const maxVal = 255;

  const {
    data: pokemonDetails,
    isLoading: detailsLoading,
    isError: detailsError,
  } = useQuery({
    queryKey: ["pokeDetails", pokemon],
    queryFn: () => getPokemonDetails(pokemon!),
    enabled: !!pokemon,
  });

  const pokemonDetailsName = pokemonDetails?.species.name;

  const {
    data: speciesInfo,
    isLoading: speciesLoading,
    isError: speciesError,
  } = useQuery({
    queryKey: ["pokeSpecDetails", pokemonDetailsName],
    queryFn: () => getPokemonSpecies(pokemonDetailsName!),
    enabled: !!pokemonDetailsName,
  });

  const evolutionChainUrl = speciesInfo?.evolution_chain?.url;
  const evolutionChainId = evolutionChainUrl
    ? extractedIdFromUrl(evolutionChainUrl)
    : undefined;

  const {
    data: pokemonEvos,
    isLoading: evosLoading,
    isError: evosError,
  } = useQuery({
    queryKey: ["pokeEvos", evolutionChainId],
    queryFn: () => getEvolutions(evolutionChainId!),
    enabled: !!evolutionChainId,
  });


  useEffect(() => {
    const pokeEvos = async () => {
      try {
        if (pokemonDetails) {
          if (pokemonEvos) {
            // injecting dipplin/hydrapple's evo conditions
            if (pokemonEvos.id === 442) {
              pokemonEvos.chain.evolves_to[2].evolution_details.push({
                gender: null,
                held_item: null,
                item: {
                  name: "syrupy-apple",
                  url: "https://pokeapi.co/api/v2/item/1174/",
                },
                known_move: null,
                known_move_type: null,
                location: null,
                min_affection: null,
                min_beauty: null,
                min_happiness: null,
                min_level: null,
                needs_overworld_rain: false,
                party_species: null,
                party_type: null,
                relative_physical_stats: null,
                time_of_day: "",
                trade_species: null,
                trigger: {
                  name: "use-item",
                  url: "https://pokeapi.co/api/v2/evolution-trigger/3/",
                },
                turn_upside_down: false,
              });

              pokemonEvos.chain.evolves_to[2].evolves_to[0].evolution_details.push(
                {
                  gender: null,
                  held_item: null,
                  item: null,
                  known_move: {
                    name: "dragon-cheer",
                    url: "https://pokeapi.co/api/v2/move/246/",
                  },
                  known_move_type: null,
                  location: null,
                  min_affection: null,
                  min_beauty: null,
                  min_happiness: null,
                  min_level: null,
                  needs_overworld_rain: false,
                  party_species: null,
                  party_type: null,
                  relative_physical_stats: null,
                  time_of_day: "",
                  trade_species: null,
                  trigger: {
                    name: "level-up",
                    url: "https://pokeapi.co/api/v2/evolution-trigger/3/",
                  },
                  turn_upside_down: false,
                }
              );
            }
            // injecting duraludon/archaludon's evo conditions
            if (pokemonEvos.id === 465) {
              pokemonEvos.chain.evolves_to[0].evolution_details.push({
                gender: null,
                held_item: null,
                item: {
                  name: "metal-alloy",
                  url: "https://pokeapi.co/api/v2/item/1174/",
                },
                known_move: null,
                known_move_type: null,
                location: null,
                min_affection: null,
                min_beauty: null,
                min_happiness: null,
                min_level: null,
                needs_overworld_rain: false,
                party_species: null,
                party_type: null,
                relative_physical_stats: null,
                time_of_day: "",
                trade_species: null,
                trigger: {
                  name: "use-item",
                  url: "https://pokeapi.co/api/v2/evolution-trigger/3/",
                },
                turn_upside_down: false,
              });
            }
          }
        }
      } catch (err: any) {
        console.error("axios error:", err.response?.status, err.response?.data);
        console.error("requested url:", err.config?.url);
        console.error("Could not retrieve pokemon", err);
      }
    };
    pokeEvos();
  }, [pokemonEvos]);

  useEffect(() => {
    if (pokemonEvos) {
      const speciesNum = extractedIdFromUrl(pokemonEvos?.chain.species.url);
      if (speciesNum) {
        setBaseNum(String(speciesNum));
      }
      const speciesImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${baseNum}.png`;
      setBaseEvo(speciesImg);
      //undefined for legendary/pokemon w no evos
      let evosBucket = [];

      let secondEvosBucket = [];

      let evos1NumBucket = [];

      let evos2NumBucket: string[] = [];

      if (pokemonEvos.chain.evolves_to.length > 0) {
        for (let i = 0; i < pokemonEvos.chain.evolves_to.length; i++) {
          const speciesNum = extractedIdFromUrl(
            pokemonEvos?.chain.evolves_to[i].species.url
          );
          if (speciesNum) {
            evos1NumBucket.push(String(speciesNum));
          }
          const speciesImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${speciesNum}.png`;
          evosBucket.push(speciesImg);
        }
        setEvo1Num(evos1NumBucket);
        setEvo1Img(evosBucket);
        if (pokemonEvos.chain.evolves_to[0].evolves_to.length > 0) {
          for (
            let j = 0;
            j < pokemonEvos.chain.evolves_to[0].evolves_to.length;
            j++
          ) {
            const speciesNum = extractedIdFromUrl(
              pokemonEvos?.chain.evolves_to[0].evolves_to[j].species.url
            );
            if (speciesNum) {
              evos2NumBucket.push(String(speciesNum));
            }
            const speciesImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${speciesNum}.png`;

            // this is only really for wurmple evo line for now
            if (pokemonEvos.chain.evolves_to[1]) {
              const speciesNum = extractedIdFromUrl(
                pokemonEvos?.chain.evolves_to[1].evolves_to[j].species.url
              );
              if (speciesNum) {
                evos2NumBucket.unshift(String(speciesNum));
              }
              const splittingSpeciesImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${speciesNum}.png`;
              secondEvosBucket.unshift(splittingSpeciesImg);
            }

            if (pokemonEvos.chain.evolves_to[1]) {
              secondEvosBucket.unshift(speciesImg);
            } else {
              secondEvosBucket.push(speciesImg);
            }
          }

          setEvo2Num(evos2NumBucket);
          setEvo2Img(secondEvosBucket);
        }
      }
      if (
        pokemonEvos.chain.evolves_to.length > 2 &&
        pokemonEvos.chain.evolves_to[2].evolves_to.length > 0
      ) {
        const speciesNum = extractedIdFromUrl(
          pokemonEvos?.chain.evolves_to[2].evolves_to[0].species.url
        );
        if (speciesNum) {
          evos2NumBucket.push(String(speciesNum));
        }
        const splittingSpeciesImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${speciesNum}.png`;
        secondEvosBucket.push(splittingSpeciesImg);

        setEvo2Num(evos2NumBucket);
        setEvo2Img(secondEvosBucket);
      }
    }
  }, [pokemonEvos, baseNum]);

  useEffect(() => {
    if (speciesInfo) {
      let varietiesBucket = [];
      for (let i = 0; i < speciesInfo.varieties.length; i++) {
        let varietyUrl = extractedIdFromUrl(
          speciesInfo.varieties[i].pokemon.url
        );
        const speciesVarietyImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${varietyUrl}.png`;
        varietiesBucket.push(speciesVarietyImg);
      }
      setVarietyImgs(varietiesBucket);
    }
  }, [speciesInfo]);

  useEffect(() => {
    const fetchImageSizes = async () => {

      if (varietyImgs.length === 0) return;

      setSizesLoading(true);

      let varietyIdBucket: number[] = [];

      const sizePromises = varietyImgs.map((uri, index) => {
        return new Promise<WidthAndHeight>((resolve) => {
          Image.getSize(uri, (width, height) => resolve({ width, height }), () => resolve({ width: 0, height: 0 }))
          const speciesVarietyUrl = speciesInfo?.varieties[index].pokemon.url!
          const varietyId = speciesVarietyUrl ? extractedIdFromUrl(speciesVarietyUrl) : undefined;
          varietyIdBucket.push(varietyId!);
        })
      })

      const sizes = await Promise.all(sizePromises);
      setImgSizes(sizes);
      setVarietyIds(varietyIdBucket);
      setSizesLoading(false);
    }

    fetchImageSizes();
  }, [varietyImgs])

  useEffect(() => {
    if (pokemonDetails) {
      navigation.setOptions({
        title: pokemonDetails.name,
        headerTitleAlign: "center",
        headerTitleStyle: { fontFamily: "Silkscreen", fontSize: 16 },
      });
    }
  }, [pokemonDetails, navigation]);

  useEffect(() => {
    const grabPokemonType = async () => {
      let typeBucket = [];
      if (pokemonDetails) {
        for (let i = 0; i < pokemonDetails.types.length; i++) {
          const pokemonTypeResp = await getPokemonType(
            pokemonDetails.types[i].type.url
          );
          typeBucket.push(pokemonTypeResp.sprites);
        }
        setPokemonType(typeBucket);
      }
    };
    grabPokemonType();
  }, [pokemonDetails]);

  useEffect(() => {
    if (pokemonType) {
      pokemonType &&
        pokemonType[0] &&
        (pokemonType[0] as any)["generation-v"] &&
        (pokemonType[0] as any["generation-v"]["black-white"]);
    }
  }, [pokemonType]);

  // useEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <Pressable onPress={toggleFavorite} style={{marginRight: 30}}>
  //         <Ionicons
  //           name={isFavorited ? "star" : "star-outline"}
  //           size={22}
  //           color="white"
  //         />
  //       </Pressable>
  //     ),
  //   });
  // }, [isFavorited]);

  const toggleFavorite = async () => {
    await AsyncStorage.setItem(
      `favorite-${pokemon}`,
      !isFavorited ? "true" : "false"
    );
    setIsFavorited(!isFavorited);
  };

  return (
    <ScrollView style={{ paddingHorizontal: 10, paddingTop: 5, marginBottom: insets.bottom, flex: 1 }}>
      {detailsLoading ? (
        <View
          style={{ display: 'flex', justifyContent: "center", alignItems: "center" }}
        >
          {/* TODO: Maybe add spinning pokeball loading animation */}
          <Text style={{ fontFamily: "Silkscreen" }}>Loading...</Text>
        </View>
      ) : (
        <>
          <View style={[styles.card, { overflow: "hidden" }]}>
            {PokeBG(pokemonDetails!.types[0].type.name)}
            <Text style={styles.pokemonName}>
              #{pokemonDetails!.id} {pokemonDetails!.name}
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <Image
                source={{ uri: pokemonDetails!.sprites!.front_default! }}
                style={{
                  width: width / 2.33,
                  height: 200,
                  padding: 5,
                  aspectRatio: "1/1",
                }}
              />
              <Image
                source={{ uri: pokemonDetails!.sprites!.front_shiny! }}
                style={{
                  width: width / 2.33,
                  height: 200,
                  padding: 5,
                  aspectRatio: "1/1",
                }}
              />
            </View>
            <View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                {pokemonType.map((item, index) => (
                  <Image
                    key={index}
                    style={{ width: 90, height: 20 }}
                    source={{
                      uri:
                        item &&
                        (item as any)["generation-viii"]["sword-shield"]
                          .name_icon,
                    }}
                  />
                ))}
              </View>
            </View>
          </View>
          {/* add to color function file rbga values for type colors */}
          <View style={[styles.card, { backgroundColor: secondaryTypeColor(pokemonDetails!.types[0].type.name) }]}>
            <Text style={styles.sectionHeader}>Stats</Text>
            {pokemonDetails!.stats.map((item: any) => (
              <View key={item.stat.name}>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text
                    style={[
                      styles.infoText,
                      {
                        color: "grey",
                      },
                    ]}
                  >
                    {item.stat.name}:
                  </Text>
                  <Text style={[styles.infoText]}> {item.base_stat}</Text>
                </View>
                <View
                  style={{
                    height: 8,
                    width: `${(item.base_stat / maxVal) * 100}%`,
                    borderWidth: 1,
                    borderColor: 'black',
                    borderStyle: 'solid',
                    backgroundColor:
                      item.base_stat <= 30
                        ? "red"
                        : item.base_stat >= 30 && item.base_stat <= 80
                          ? "orange"
                          : item.base_stat >= 80 && item.base_stat <= 140
                            ? "green"
                            : item.base_stat >= 140 && item.base_stat <= 250
                              ? "#4af"
                              : "turquoise",
                  }}
                ></View>
              </View>
            ))}
          </View>
          <View style={[styles.card, { width: "100%", backgroundColor: secondaryTypeColor(pokemonDetails!.types[0].type.name) }]}>
            <Text style={styles.sectionHeader}>Pokedex Entry</Text>
            <Text
              style={[
                styles.infoText,
                { fontSize: 12, textAlign: "center", padding: 5 },
              ]}
            >
              {speciesInfo?.flavor_text_entries
                .filter((el) => el.language.name === "en")[0]
                .flavor_text.replaceAll("\n", " ")}
            </Text>
          </View>
          <View style={[styles.card, { backgroundColor: secondaryTypeColor(pokemonDetails!.types[0].type.name) }]}>
            <Text style={styles.sectionHeader}>Evolution Chain</Text>

            {!evosLoading ? (
              <View>
                {pokemonEvos?.chain.evolves_to &&
                  pokemonEvos?.chain.evolves_to.length > 0 &&
                  pokemonEvos?.chain.evolves_to[0].evolution_details.length >
                  0 && (
                    <View style={styles.evolutionSection}>
                      {baseEvo && (
                        <Link
                          href={`/(pokemon)/pokemonDetails/${baseNum}`}
                          asChild
                        >
                          <Pressable>
                            <Image
                              source={{ uri: baseEvo }}
                              style={{
                                width: width / 5 - 15,
                                height: 80,
                                padding: 5,
                                aspectRatio: "1/1",
                              }}
                            />
                          </Pressable>
                        </Link>
                      )}

                      {/* first evo starts here  */}
                      {pokemonEvos?.chain.evolves_to &&
                        pokemonEvos?.chain.evolves_to.length > 0 && (
                          <View>
                            {pokemonEvos?.chain.evolves_to.map(
                              (firstEvo, feIndex) => (
                                <View
                                  key={feIndex}
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "flex-start",
                                  }}
                                >
                                  <View
                                    key={feIndex}
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      alignItems: "center",
                                    }}
                                  >
                                    <View
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        width: width / 5 - 15,
                                      }}
                                    >
                                      <ArrowRight width={24} height={24} />

                                      {/* Level up trigger */}

                                      {firstEvo.evolution_details[0].trigger
                                        .name === "level-up" && (
                                          <Text
                                            style={[
                                              styles.infoText,
                                              {
                                                fontSize: 9,
                                                textAlign: "center",
                                              },
                                            ]}
                                          >
                                            {
                                              firstEvo.evolution_details[0]
                                                .trigger.name
                                            }
                                          </Text>
                                        )}

                                      {firstEvo.evolution_details[0]
                                        .min_level !== null && (
                                          <Text
                                            style={[
                                              styles.infoText,
                                              { fontSize: 9 },
                                            ]}
                                          >
                                            Lvl{" "}
                                            {
                                              firstEvo.evolution_details[0]
                                                .min_level
                                            }
                                          </Text>
                                        )}

                                      {/* Item trigger */}

                                      {firstEvo.evolution_details[0].item !==
                                        null && (
                                          <View
                                            style={{
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "center",
                                            }}
                                          >
                                            {firstEvo.evolution_details[0].item
                                              .name === "black-augurite" ||
                                              firstEvo.evolution_details[0].item
                                                .name === "tart-apple" ||
                                              firstEvo.evolution_details[0].item
                                                .name === "tart-apple" ||
                                              firstEvo.evolution_details[0].item
                                                .name === "sweet-apple" ||
                                              firstEvo.evolution_details[0].item
                                                .name === "syrupy-apple" ||
                                              firstEvo.evolution_details[0].item
                                                .name === "metal-alloy" ||
                                              firstEvo.evolution_details[0].item
                                                .name === "auspicious-armor" ||
                                              firstEvo.evolution_details[0].item
                                                .name === "malicious-armor" ? (
                                              <Text
                                                style={[
                                                  styles.infoText,
                                                  {
                                                    fontSize: 8,
                                                    textAlign: "center",
                                                  },
                                                ]}
                                              >
                                                {firstEvo.evolution_details[0].item.name.replace(
                                                  "-",
                                                  "\n"
                                                )}
                                              </Text>
                                            ) : (
                                              <Image
                                                alt={
                                                  firstEvo.evolution_details[0]
                                                    .item.name
                                                }
                                                source={{
                                                  uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${firstEvo.evolution_details[0].item.name}.png`,
                                                }}
                                                style={{ height: 20, width: 20 }}
                                              />
                                            )}
                                          </View>
                                        )}

                                      {/* Happiness/Friendship/Affection trigger */}

                                      {!evosLoading &&
                                        firstEvo.evolution_details[0]
                                          .min_happiness && (
                                          <>
                                            <Heart width={14} height={14} />
                                            <Text
                                              style={[
                                                styles.infoText,
                                                { fontSize: 9 },
                                              ]}
                                            >
                                              Happiness
                                            </Text>
                                          </>
                                        )}

                                      {firstEvo.evolution_details[0]
                                        .min_affection && (
                                          <>
                                            <Heart width={14} height={14} />
                                            <Text
                                              style={[
                                                styles.infoText,
                                                { fontSize: 9 },
                                              ]}
                                            >
                                              Happiness
                                            </Text>
                                          </>
                                        )}

                                      {/* time of day trigger add-on */}

                                      {firstEvo.evolution_details[0]
                                        .time_of_day && (
                                          <Text
                                            style={[
                                              styles.infoText,
                                              { fontSize: 9 },
                                            ]}
                                          >
                                            {
                                              firstEvo.evolution_details[0]
                                                .time_of_day
                                            }
                                          </Text>
                                        )}

                                      {/* Other evo triggers */}

                                      {firstEvo.species.name ===
                                        "sirfetchd" && (
                                          <Text
                                            style={[
                                              styles.infoText,
                                              { fontSize: 9 },
                                            ]}
                                          >
                                            Land 3 crits {"\n"} in 1 battle
                                          </Text>
                                        )}

                                      {firstEvo.species.name ===
                                        "hitmonchan" && (
                                          <Text
                                            style={[
                                              styles.infoText,
                                              { fontSize: 9 },
                                            ]}
                                          >
                                            {"def > atk"}
                                          </Text>
                                        )}

                                      {firstEvo.species.name ===
                                        "hitmonlee" && (
                                          <Text
                                            style={[
                                              styles.infoText,
                                              { fontSize: 9 },
                                            ]}
                                          >
                                            {"atk > def"}
                                          </Text>
                                        )}

                                      {firstEvo.species.name ===
                                        "hitmontop" && (
                                          <Text
                                            style={[
                                              styles.infoText,
                                              { fontSize: 9 },
                                            ]}
                                          >
                                            {"atk = def"}
                                          </Text>
                                        )}

                                      {firstEvo.species.name === "shedinja" && (
                                        <View
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          <Text
                                            style={[
                                              styles.infoText,
                                              {
                                                fontSize: 9,
                                                textAlign: "center",
                                              },
                                            ]}
                                          >
                                            Evolve w {"\n"} party space
                                          </Text>
                                        </View>
                                      )}

                                      {firstEvo.species.name ===
                                        "basculegion" && (
                                          <View
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            <Text
                                              style={[
                                                styles.infoText,
                                                {
                                                  fontSize: 9,
                                                  textAlign: "center",
                                                },
                                              ]}
                                            >
                                              300 dmg {"\n"} in recoil
                                            </Text>
                                          </View>
                                        )}

                                      {firstEvo.species.name ===
                                        "runerigus" && (
                                          <View
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            <Text
                                              style={[
                                                styles.infoText,
                                                {
                                                  fontSize: 9,
                                                  textAlign: "center",
                                                },
                                              ]}
                                            >
                                              49+ dmg {"\n"} dusty bowl
                                            </Text>
                                          </View>
                                        )}

                                      {/* Trade Evo Trigger */}

                                      {firstEvo.evolution_details[0].trigger
                                        .name === "trade" && (
                                          <Text
                                            style={[
                                              styles.infoText,
                                              { fontSize: 9 },
                                            ]}
                                          >
                                            {
                                              firstEvo.evolution_details[0]
                                                .trigger.name
                                            }
                                          </Text>
                                        )}

                                      {/* Trade with certain species trigger */}

                                      {firstEvo.evolution_details[0]
                                        .trade_species && (
                                          <Text
                                            style={[
                                              styles.infoText,
                                              {
                                                fontSize: 9,
                                                textAlign: "center",
                                              },
                                            ]}
                                          >
                                            w{"\n"}
                                            {
                                              firstEvo.evolution_details[0]
                                                .trade_species.name
                                            }
                                          </Text>
                                        )}

                                      {/* Level up location Evo Trigger */}

                                      {firstEvo.evolution_details[0]
                                        .location && (
                                          <View
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            <Text
                                              style={[
                                                styles.infoText,
                                                {
                                                  fontSize: 9,
                                                  textAlign: "center",
                                                },
                                              ]}
                                            >
                                              {firstEvo.evolution_details[0].location.name.replace(
                                                "-",
                                                "\n"
                                              )}
                                            </Text>
                                            {firstEvo.evolution_details[0]
                                              .held_item && (
                                                <Text
                                                  style={[
                                                    styles.infoText,
                                                    { fontSize: 9 },
                                                  ]}
                                                >
                                                  +{" "}
                                                </Text>
                                              )}
                                          </View>
                                        )}

                                      {/* Known Move TYPE Evo Trigger */}

                                      {firstEvo.evolution_details[0]
                                        .known_move_type && (
                                          <Text
                                            style={[
                                              styles.infoText,
                                              {
                                                fontSize: 9,
                                                textAlign: "center",
                                                width: width / 5 - 10,
                                              },
                                            ]}
                                          >
                                            knowing {"\n"}{" "}
                                            {
                                              firstEvo.evolution_details[0]
                                                .known_move_type.name
                                            }{" "}
                                            {"\n"} move
                                          </Text>
                                        )}

                                      {/* Known Moves Evo Trigger */}

                                      {firstEvo.evolution_details[0]
                                        .known_move && (
                                          <Text
                                            style={[
                                              styles.infoText,
                                              {
                                                fontSize: 9,
                                                textAlign: "center",
                                                width: width / 5 - 10,
                                              },
                                            ]}
                                          >
                                            knowing {"\n"}{" "}
                                            {
                                              firstEvo.evolution_details[0]
                                                .known_move.name
                                            }
                                          </Text>
                                        )}

                                      {firstEvo.evolution_details[0]
                                        .held_item && (
                                          <>
                                            <Text
                                              style={[
                                                styles.infoText,
                                                { fontSize: 9 },
                                              ]}
                                            >
                                              +{" "}
                                            </Text>
                                            <Image
                                              source={{
                                                uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${firstEvo.evolution_details[0].held_item.name}.png`,
                                              }}
                                              style={{ height: 20, width: 20 }}
                                            />
                                          </>
                                        )}

                                      {/* Party member evo trigger */}

                                      {firstEvo.evolution_details[0]
                                        .party_species && (
                                          <Text
                                            style={[
                                              styles.infoText,
                                              {
                                                fontSize: 9,
                                                textAlign: "center",
                                              },
                                            ]}
                                          >
                                            + {"\n"}{" "}
                                            {
                                              firstEvo.evolution_details[0]
                                                .party_species.name
                                            }{" "}
                                            {"\n"} in team
                                          </Text>
                                        )}

                                      {/* Gender conditions*/}

                                      {firstEvo.evolution_details[0].gender && (
                                        <Text
                                          style={[
                                            styles.infoText,
                                            {
                                              fontSize: 9,
                                              textAlign: "center",
                                            },
                                          ]}
                                        >
                                          {firstEvo.evolution_details[0]
                                            .gender === 2
                                            ? "Male"
                                            : "Female"}
                                        </Text>
                                      )}
                                    </View>
                                    {evo1Img[feIndex] && (
                                      <Link
                                        href={`/(pokemon)/pokemonDetails/${evo1Num[feIndex]}`}
                                        asChild
                                      >
                                        <Pressable>
                                          <Image
                                            source={{ uri: evo1Img[feIndex] }}
                                            style={{
                                              width: width / 5 - 15,
                                              height: 80,
                                              padding: 5,
                                              aspectRatio: "1/1",
                                            }}
                                          />
                                        </Pressable>
                                      </Link>
                                    )}
                                  </View>

                                  {/* second evos starts here */}

                                  {/* evo split for complex lines like silcoon/cascoon */}

                                  {pokemonEvos?.chain.evolves_to[feIndex]
                                    .evolves_to &&
                                    pokemonEvos?.chain.evolves_to.length > 1 ? (
                                    <View>
                                      {pokemonEvos?.chain.evolves_to[
                                        feIndex
                                      ].evolves_to.map((secEvo, seIndex) => (
                                        <View
                                          key={seIndex}
                                          style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                          }}
                                        >
                                          {/* Level up trigger */}

                                          <View>
                                            <View
                                              style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                width: width / 5 - 15,
                                              }}
                                            >
                                              <ArrowRight
                                                width={24}
                                                height={24}
                                              />

                                              {secEvo.evolution_details[seIndex]
                                                .trigger.name ===
                                                "level-up" && (
                                                  <Text
                                                    style={[
                                                      styles.infoText,
                                                      { fontSize: 9 },
                                                    ]}
                                                  >
                                                    {
                                                      secEvo.evolution_details[
                                                        seIndex
                                                      ].trigger.name
                                                    }
                                                  </Text>
                                                )}

                                              {secEvo.evolution_details[seIndex]
                                                .min_level !== null && (
                                                  <Text
                                                    style={[
                                                      styles.infoText,
                                                      { fontSize: 10 },
                                                    ]}
                                                  >
                                                    Lvl{" "}
                                                    {
                                                      secEvo.evolution_details[
                                                        seIndex
                                                      ].min_level
                                                    }
                                                  </Text>
                                                )}
                                            </View>

                                            {/* Item trigger */}

                                            {secEvo.evolution_details[seIndex]
                                              .item !== null && (
                                                <View
                                                  style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                  }}
                                                >
                                                  {secEvo.evolution_details[
                                                    seIndex
                                                  ].item.name === "peat-block" ? (
                                                    <Text
                                                      style={[
                                                        styles.infoText,
                                                        {
                                                          fontSize: 9,
                                                          textAlign: "center",
                                                        },
                                                      ]}
                                                    >
                                                      peat{"\n"}block
                                                    </Text>
                                                  ) : (
                                                    <Image
                                                      source={{
                                                        uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${secEvo.evolution_details[seIndex].item?.name}.png`,
                                                      }}
                                                      style={{
                                                        height: 20,
                                                        width: 20,
                                                      }}
                                                    />
                                                  )}
                                                </View>
                                              )}

                                            {/* other (WIP) */}

                                            {secEvo.species.name ===
                                              "annihilape" && (
                                                <View
                                                  style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                  }}
                                                >
                                                  <Text
                                                    style={[
                                                      styles.infoText,
                                                      {
                                                        fontSize: 9,
                                                        textAlign: "center",
                                                      },
                                                    ]}
                                                  >
                                                    Use Rage {"\n"} Fist x20
                                                  </Text>
                                                </View>
                                              )}

                                            {/* Happiness trigger */}

                                            {secEvo.evolution_details[seIndex]
                                              .min_happiness != null && (
                                                <View
                                                  style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                  }}
                                                >
                                                  <Heart width={14} height={14} />
                                                  <Text
                                                    style={[
                                                      styles.infoText,
                                                      { fontSize: 9 },
                                                    ]}
                                                  >
                                                    Happiness
                                                  </Text>

                                                  {/* Time of day add-on */}

                                                  {secEvo.evolution_details[
                                                    seIndex
                                                  ].time_of_day && (
                                                      <Text
                                                        style={[
                                                          styles.infoText,
                                                          { fontSize: 9 },
                                                        ]}
                                                      >
                                                        {
                                                          secEvo.evolution_details[
                                                            seIndex
                                                          ].time_of_day
                                                        }
                                                      </Text>
                                                    )}
                                                </View>
                                              )}

                                            {/* Trade Evo Trigger */}

                                            {secEvo.evolution_details[seIndex]
                                              .trigger.name === "trade" && (
                                                <View
                                                  style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                  }}
                                                >
                                                  <Text
                                                    style={[
                                                      styles.infoText,
                                                      { fontSize: 9 },
                                                    ]}
                                                  >
                                                    {
                                                      secEvo.evolution_details[
                                                        seIndex
                                                      ].trigger.name
                                                    }
                                                  </Text>
                                                  {secEvo.evolution_details[
                                                    seIndex
                                                  ].held_item && (
                                                      <>
                                                        <Text
                                                          style={[
                                                            styles.infoText,
                                                            { fontSize: 9 },
                                                          ]}
                                                        >
                                                          +{" "}
                                                        </Text>
                                                        <Image
                                                          source={{
                                                            uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${secEvo.evolution_details[seIndex].held_item.name}.png`,
                                                          }}
                                                          style={{
                                                            height: 20,
                                                            width: 20,
                                                          }}
                                                        />
                                                      </>
                                                    )}
                                                </View>
                                              )}

                                            {/* Level up location Evo Trigger */}

                                            {secEvo.evolution_details[seIndex]
                                              .location && (
                                                <View
                                                  style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                  }}
                                                >
                                                  <Text
                                                    style={[
                                                      styles.infoText,
                                                      {
                                                        fontSize: 9,
                                                        textAlign: "center",
                                                      },
                                                    ]}
                                                  >
                                                    {
                                                      secEvo.evolution_details[
                                                        seIndex
                                                      ].trigger.name
                                                    }{" "}
                                                    {"\n"}{" "}
                                                    {secEvo.evolution_details[
                                                      seIndex
                                                    ].location.name.replace(
                                                      "-",
                                                      "\n"
                                                    )}
                                                  </Text>
                                                  {secEvo.evolution_details[
                                                    seIndex
                                                  ].held_item && (
                                                      <Text
                                                        style={[
                                                          styles.infoText,
                                                          { fontSize: 9 },
                                                        ]}
                                                      >
                                                        +{" "}
                                                      </Text>
                                                    )}
                                                </View>
                                              )}

                                            {/* Known Moves Evo Trigger */}

                                            {secEvo.evolution_details[seIndex]
                                              .known_move && (
                                                <>
                                                  <Text
                                                    style={[
                                                      styles.infoText,
                                                      {
                                                        fontSize: 9,
                                                        textAlign: "center",
                                                        width: width / 5 - 10,
                                                      },
                                                    ]}
                                                  >
                                                    knowing {"\n"}{" "}
                                                    {secEvo.evolution_details[
                                                      seIndex
                                                    ].known_move.name.replace(
                                                      "-",
                                                      "\n"
                                                    )}
                                                  </Text>
                                                  {secEvo.evolution_details[
                                                    seIndex
                                                  ].held_item && (
                                                      <>
                                                        <Text
                                                          style={[
                                                            styles.infoText,
                                                            { fontSize: 9 },
                                                          ]}
                                                        >
                                                          +{" "}
                                                        </Text>
                                                        <Image
                                                          source={{
                                                            uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${secEvo.evolution_details[seIndex].held_item.name}.png`,
                                                          }}
                                                          style={{
                                                            height: 20,
                                                            width: 20,
                                                          }}
                                                        />
                                                      </>
                                                    )}
                                                </>
                                              )}

                                            {/* Gender conditions*/}

                                            {secEvo.evolution_details[0]
                                              .gender && (
                                                <Text
                                                  style={[
                                                    styles.infoText,
                                                    {
                                                      fontSize: 9,
                                                      textAlign: "center",
                                                    },
                                                  ]}
                                                >
                                                  {secEvo.evolution_details[0]
                                                    .gender === 2
                                                    ? "Male"
                                                    : "Female"}
                                                </Text>
                                              )}
                                          </View>
                                          {evo2Img[feIndex] ? (
                                            <Link
                                              href={`/(pokemon)/pokemonDetails/${evo2Num[feIndex]}`}
                                              asChild
                                            >
                                              <Pressable>
                                                <Image
                                                  source={{
                                                    uri: evo2Img[feIndex],
                                                  }}
                                                  style={{
                                                    width: width / 5 - 15,
                                                    height: 80,
                                                    padding: 5,
                                                    aspectRatio: "1/1",
                                                  }}
                                                />
                                              </Pressable>
                                            </Link>
                                          ) : (
                                            <Link
                                              href={`/(pokemon)/pokemonDetails/${evo2Num[seIndex]}`}
                                              asChild
                                            >
                                              <Pressable>
                                                <Image
                                                  source={{
                                                    uri: evo2Img[seIndex],
                                                  }}
                                                  style={{
                                                    width: width / 5 - 15,
                                                    height: 80,
                                                    padding: 5,
                                                    aspectRatio: "1/1",
                                                  }}
                                                />
                                              </Pressable>
                                            </Link>
                                          )}
                                        </View>
                                      ))}
                                    </View>
                                  ) : (
                                    <View>
                                      {/* regular second evo splits start here */}

                                      {pokemonEvos?.chain.evolves_to[
                                        feIndex
                                      ].evolves_to.map((secEvo, seIndex) => (
                                        <View
                                          key={seIndex}
                                          style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                          }}
                                        >
                                          {/* Level up trigger */}

                                          <View>
                                            <View
                                              style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                              }}
                                            >
                                              <ArrowRight
                                                width={24}
                                                height={24}
                                              />

                                              {secEvo.evolution_details[feIndex]
                                                .trigger.name ===
                                                "level-up" && (
                                                  <Text
                                                    style={[
                                                      styles.infoText,
                                                      { fontSize: 9 },
                                                    ]}
                                                  >
                                                    {
                                                      secEvo.evolution_details[
                                                        feIndex
                                                      ].trigger.name
                                                    }
                                                  </Text>
                                                )}

                                              {secEvo.evolution_details[feIndex]
                                                .min_level !== null && (
                                                  <Text
                                                    style={[
                                                      styles.infoText,
                                                      { fontSize: 10 },
                                                    ]}
                                                  >
                                                    Lvl{" "}
                                                    {
                                                      secEvo.evolution_details[
                                                        feIndex
                                                      ].min_level
                                                    }
                                                  </Text>
                                                )}
                                            </View>

                                            {/* Item trigger */}

                                            {secEvo.evolution_details[feIndex]
                                              .item !== null && (
                                                <View
                                                  style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                  }}
                                                >
                                                  {secEvo.evolution_details[
                                                    feIndex
                                                  ].item.name === "peat-block" ? (
                                                    <Text
                                                      style={[
                                                        styles.infoText,
                                                        {
                                                          fontSize: 9,
                                                          textAlign: "center",
                                                        },
                                                      ]}
                                                    >
                                                      peat{"\n"}block
                                                    </Text>
                                                  ) : (
                                                    <Image
                                                      source={{
                                                        uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${secEvo.evolution_details[feIndex].item?.name}.png`,
                                                      }}
                                                      style={{
                                                        height: 20,
                                                        width: 20,
                                                      }}
                                                    />
                                                  )}
                                                </View>
                                              )}

                                            {/* other (WIP) */}

                                            {secEvo.species.name ===
                                              "annihilape" && (
                                                <View
                                                  style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                  }}
                                                >
                                                  <Text
                                                    style={[
                                                      styles.infoText,
                                                      { fontSize: 9 },
                                                    ]}
                                                  >
                                                    Use Rage {"\n"} Fist x20
                                                  </Text>
                                                </View>
                                              )}

                                            {secEvo.species.name ===
                                              "kingambit" && (
                                                <View
                                                  style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                  }}
                                                >
                                                  <Text
                                                    style={[
                                                      styles.infoText,
                                                      {
                                                        fontSize: 8,
                                                        textAlign: "center",
                                                      },
                                                    ]}
                                                  >
                                                    Defeat {"\n"} bisharp {"\n"}{" "}
                                                    x3 & {"\n"} Lvl up + {"\n"}{" "}
                                                    Leaders crest
                                                  </Text>
                                                </View>
                                              )}

                                            {/* Happiness trigger */}

                                            {secEvo.evolution_details[feIndex]
                                              .min_happiness != null && (
                                                <View
                                                  style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                  }}
                                                >
                                                  <Heart width={14} height={14} />
                                                  <Text
                                                    style={[
                                                      styles.infoText,
                                                      { fontSize: 9 },
                                                    ]}
                                                  >
                                                    Happiness
                                                  </Text>

                                                  {/* Time of day add-on */}

                                                  {secEvo.evolution_details[
                                                    feIndex
                                                  ].time_of_day && (
                                                      <Text
                                                        style={[
                                                          styles.infoText,
                                                          { fontSize: 9 },
                                                        ]}
                                                      >
                                                        {
                                                          secEvo.evolution_details[
                                                            feIndex
                                                          ].time_of_day
                                                        }
                                                      </Text>
                                                    )}
                                                </View>
                                              )}

                                            {/* Trade Evo Trigger */}

                                            {secEvo.evolution_details[feIndex]
                                              .trigger.name === "trade" && (
                                                <View
                                                  style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                  }}
                                                >
                                                  <Text
                                                    style={[
                                                      styles.infoText,
                                                      { fontSize: 9 },
                                                    ]}
                                                  >
                                                    {
                                                      secEvo.evolution_details[
                                                        feIndex
                                                      ].trigger.name
                                                    }
                                                  </Text>
                                                  {secEvo.evolution_details[
                                                    feIndex
                                                  ].held_item && (
                                                      <>
                                                        <Text
                                                          style={[
                                                            styles.infoText,
                                                            { fontSize: 9 },
                                                          ]}
                                                        >
                                                          +{" "}
                                                        </Text>
                                                        <Image
                                                          source={{
                                                            uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${secEvo.evolution_details[feIndex].held_item.name}.png`,
                                                          }}
                                                          style={{
                                                            height: 20,
                                                            width: 20,
                                                          }}
                                                        />
                                                      </>
                                                    )}
                                                </View>
                                              )}

                                            {/* Level up location Evo Trigger */}

                                            {secEvo.evolution_details[feIndex]
                                              .location && (
                                                <View
                                                  style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                  }}
                                                >
                                                  <Text
                                                    style={[
                                                      styles.infoText,
                                                      {
                                                        fontSize: 9,
                                                        textAlign: "center",
                                                      },
                                                    ]}
                                                  >
                                                    {secEvo.evolution_details[
                                                      feIndex
                                                    ].location.name.replace(
                                                      "-",
                                                      "\n"
                                                    )}
                                                  </Text>
                                                  {secEvo.evolution_details[
                                                    feIndex
                                                  ].held_item && (
                                                      <Text
                                                        style={[
                                                          styles.infoText,
                                                          { fontSize: 9 },
                                                        ]}
                                                      >
                                                        +{" "}
                                                      </Text>
                                                    )}
                                                </View>
                                              )}

                                            {/* Known Moves Evo Trigger */}

                                            {secEvo.evolution_details[feIndex]
                                              .known_move && (
                                                <>
                                                  <Text
                                                    style={[
                                                      styles.infoText,
                                                      {
                                                        fontSize: 9,
                                                        textAlign: "center",
                                                      },
                                                    ]}
                                                  >
                                                    knowing {"\n"}{" "}
                                                    {
                                                      secEvo.evolution_details[
                                                        feIndex
                                                      ].known_move.name
                                                    }
                                                  </Text>
                                                  {secEvo.evolution_details[
                                                    feIndex
                                                  ].held_item && (
                                                      <>
                                                        <Text
                                                          style={[
                                                            styles.infoText,
                                                            { fontSize: 9 },
                                                          ]}
                                                        >
                                                          +{" "}
                                                        </Text>
                                                        <Image
                                                          source={{
                                                            uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${secEvo.evolution_details[feIndex].held_item.name}.png`,
                                                          }}
                                                          style={{
                                                            height: 20,
                                                            width: 20,
                                                          }}
                                                        />
                                                      </>
                                                    )}
                                                </>
                                              )}

                                            {/* Gender conditions*/}

                                            {secEvo.evolution_details[0]
                                              .gender && (
                                                <Text
                                                  style={[
                                                    styles.infoText,
                                                    {
                                                      fontSize: 9,
                                                      textAlign: "center",
                                                    },
                                                  ]}
                                                >
                                                  {secEvo.evolution_details[0]
                                                    .gender === 2
                                                    ? "Male"
                                                    : "Female"}
                                                </Text>
                                              )}
                                          </View>
                                          {evo2Img[seIndex] && (
                                            <Link
                                              href={`/(pokemon)/pokemonDetails/${evo2Num[seIndex]}`}
                                              asChild
                                            >
                                              <Pressable>
                                                <Image
                                                  source={{
                                                    uri: evo2Img[seIndex],
                                                  }}
                                                  style={{
                                                    width: width / 5 - 15,
                                                    height: 80,
                                                    padding: 5,
                                                    aspectRatio: "1/1",
                                                  }}
                                                />
                                              </Pressable>
                                            </Link>
                                          )}
                                        </View>
                                      ))}
                                    </View>
                                  )}
                                </View>
                              )
                            )}
                          </View>
                        )}
                    </View>
                  )}
                {pokemonEvos?.chain.evolves_to.length === 0 && (
                  <View
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={{ uri: pokemonDetails!.sprites!.front_default! }}
                      style={{
                        width: width,
                        height: 80,
                        padding: 5,
                        aspectRatio: "1/1",
                      }}
                    />
                    <Text
                      style={[
                        styles.infoText,
                        { textAlign: "center", fontSize: 11 },
                      ]}
                    >
                      This Pokemon does not evolve.
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <ActivityIndicator size={20} />
            )}
          </View>

          <View style={[styles.card, { backgroundColor: secondaryTypeColor(pokemonDetails!.types[0].type.name) }]}>
            <Text style={styles.sectionHeader}>Varieties</Text>
            {speciesLoading ? (
              <ActivityIndicator />
            ) : (
              <ScrollView horizontal>
                {speciesInfo?.varieties.length! > 1 ? (
                  speciesInfo?.varieties.map((variety, index) => {
                    return (
                      <View
                        key={index}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-around",
                          alignItems: 'center'
                        }}
                      >
                        {varietyImgs && varietyImgs?.length > 0 && (
                          <Link
                            href={`/(pokemon)/pokemonDetails/${variety.pokemon.name}`}
                            asChild
                          >
                            <Pressable>
                              {sizesLoading ? (
                                <ActivityIndicator />
                              ) : (
                                <Image
                                  source={{
                                    uri:
                                      imgSizes[index].width > 0 ?
                                        varietyImgs[index]
                                        :
                                        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${varietyIds[index]}.png`
                                  }}
                                  style={{ width: 80, height: 80 }}
                                />)}
                            </Pressable>
                          </Link>
                        )}
                      </View>
                    )
                  })
                ) : (
                  <Text
                    style={[
                      styles.infoText,
                      { fontSize: 11, textAlign: "center" },
                    ]}
                  >
                    This pokemon has no alternate varieties
                  </Text>
                )}
              </ScrollView>
            )}
          </View>
          <View style={[styles.card, { marginBottom: 10, backgroundColor: secondaryTypeColor(pokemonDetails!.types[0].type.name) }]}>
            <Text style={styles.sectionHeader}>Abilities</Text>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 10,
                gap: 10,
              }}
            >
              {pokemonDetails!.abilities.map((ability, index) => (
                <View
                  key={index}
                  style={{
                    borderColor: "black",
                    borderWidth: 1,
                    borderStyle: "solid",
                    width: "100%",
                    backgroundColor: ability.is_hidden ? "black" : "white",
                  }}
                >
                  <Text
                    style={[
                      styles.infoText,
                      {
                        fontSize: 11,
                        padding: 7,
                        textAlign: "center",
                        color: ability.is_hidden ? "white" : "black",
                      },
                    ]}
                  >
                    {ability.ability.name}
                  </Text>
                  <Ionicons
                    style={{
                      position: "absolute",
                      right: 5,
                      top: "15%",
                    }}
                    name="information"
                    size={17}
                    color={ability.is_hidden ? "white" : "black"}
                  />
                  {ability.is_hidden && (
                    <Text
                      style={[
                        styles.infoText,
                        {
                          position: "absolute",
                          bottom: 2,
                          left: 5,
                          color: "grey",
                          fontSize: 8,
                        },
                      ]}
                    >
                      Hidden
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
  },
  pokemonName: {
    fontSize: 16,
    fontFamily: "Silkscreen",
    textAlign: "center",
  },

  infoText: {
    fontFamily: "Silkscreen",
  },

  sectionHeader: {
    fontFamily: "Silkscreen",
    fontSize: 16,
    textAlign: "center",
    paddingBottom: 15,
  },

  evolutionSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Details;
