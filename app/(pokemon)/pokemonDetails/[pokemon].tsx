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
import type { EvolutionChain } from "pokenode-ts";
import React, { useEffect, useState } from "react";
import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import { Pokemon, Generation } from "@/interface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import pokeApi from "@/api/pokeapi";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ArrowRight from "@/assets/Icons/Arrow-Right.svg";
import Heart from "@/assets/Icons/Pixel-Heart.svg";

const Details = () => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const { getPokemonDetails, getPokemonType, getEvolutions, extractedIdFromUrl } = pokeApi();

  const { pokemon } = useLocalSearchParams<{ pokemon: string }>();
  const navigation = useNavigation();

  const [pokemonDetails, setPokemonDetails] = useState<Pokemon>();
  const [pokemonEvos, setPokemonEvos] = useState<EvolutionChain>();
  const [baseEvo, setBaseEvo] = useState<string>("");
  const [evo1Img, setEvo1Img] = useState<string[]>([]);
  const [evo2Img, setEvo2Img] = useState<string[]>([]);

  const [baseNum, setBaseNum] = useState<string>("");
  const [evo1Num, setEvo1Num] = useState<string[]>([]);
  const [evo2Num, setEvo2Num] = useState<string[]>([]);

  const [evosLoading, setEvosLoading] = useState<boolean>(true);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [pokemonType, setPokemonType] = useState<Generation[]>([]);

  const [speciesId, setSpeciesId] = useState<number>(0)

  const maxVal = 255;

  useEffect(() => {
    const pokeDetails = async () => {
      const pokeDetailsResp = await getPokemonDetails(pokemon!);
      console.log("pokemon details", pokeDetailsResp);
      setPokemonDetails(pokeDetailsResp);

      const isFavorite = await AsyncStorage.getItem(`favorite-${pokemon}`);
      setIsFavorited(isFavorite === "true");
    };
    pokeDetails();
  }, [pokemon]);

  useEffect(() => {
    setEvosLoading(true);
    const pokeEvos = async () => {

      try {
        if (pokemonDetails) {
          const pokemonSpecId = extractedIdFromUrl(pokemonDetails.species.url);
          if (pokemonSpecId) {
            setSpeciesId(pokemonSpecId);
          }
          if (speciesId) {
            const evos = await getEvolutions(speciesId);
            setPokemonEvos(evos);
            setEvosLoading(false);
          }
        }
      } catch (err: any) {
        console.error('axios error:', err.response?.status, err.response?.data);
        console.error('requested url:', err.config?.url);
        console.error("Could not retrieve pokemon", err);
      }
    };
    pokeEvos();
  }, [pokemonDetails, speciesId]);

  useEffect(() => {
    if (pokemonEvos) {
      const speciesUrl = pokemonEvos?.chain.species.url.match(/\/(\d+)\/?$/);
      const speciesNum = speciesUrl ? speciesUrl[1] : null;
      if (speciesNum) {
        setBaseNum(speciesNum);
      }
      const speciesImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${baseNum}.png`;
      setBaseEvo(speciesImg);
      //undefined for legendary pokemon
      let evosBucket = [];

      let secondEvosBucket = [];

      let evos1NumBucket = [];

      let evos2NumBucket: string[] = [];

      if (pokemonEvos.chain.evolves_to.length > 0) {
        for (let i = 0; i < pokemonEvos.chain.evolves_to.length; i++) {
          const speciesUrl =
            pokemonEvos?.chain.evolves_to[i].species.url.match(
              /\/(\d+)\/$/
            );
          const speciesNum = speciesUrl ? speciesUrl[1] : null;
          if (speciesNum) {
            evos1NumBucket.push(speciesNum);
          }
          const speciesImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${speciesNum}.png`;
          evosBucket.push(speciesImg);
        }
        setEvo1Num(evos1NumBucket);
        setEvo1Img(evosBucket);
        if (pokemonEvos.chain.evolves_to[0].evolves_to.length > 0) {
          for (let i = 0; i < pokemonEvos.chain.evolves_to[0].evolves_to.length; i++) {
            const speciesUrl =
              pokemonEvos?.chain.evolves_to[0].evolves_to[i].species.url.match(
                /\/(\d+)\/$/
              );
            const speciesNum = speciesUrl ? speciesUrl[1] : null;
            if (speciesNum) {
              evos2NumBucket.push(speciesNum);
            }
            const speciesImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${speciesNum}.png`;
            secondEvosBucket.push(speciesImg);
          }
          setEvo2Num(evos2NumBucket);
          setEvo2Img(secondEvosBucket);
        }
      }
    }
  }, [pokemonEvos, baseNum]);

  useEffect(() => {
    if (pokemonDetails) {
      navigation.setOptions({
        title:
          pokemonDetails.name,
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

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text onPress={toggleFavorite}>
          <Ionicons
            name={isFavorited ? "star" : "star-outline"}
            size={22}
            color="white"
          />
        </Text>
      ),
    });
  }, [isFavorited]);

  const toggleFavorite = async () => {
    await AsyncStorage.setItem(
      `favorite-${pokemon}`,
      !isFavorited ? "true" : "false"
    );
    setIsFavorited(!isFavorited);
  };

  return (
    <ScrollView style={{ padding: 10, marginBottom: insets.bottom, flex: 1 }}>
      {pokemonDetails && (
        <>
          <View style={styles.card}>
            <Text style={styles.pokemonName}>
              #{pokemonDetails.id} {pokemonDetails.name}
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <Image
                source={{ uri: pokemonDetails.sprites.front_default! }}
                style={{
                  width: width / 2.33,
                  height: 200,
                  padding: 5,
                  aspectRatio: "1/1",
                }}
              />
              <Image
                source={{ uri: pokemonDetails.sprites.front_shiny! }}
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
                        (item as any)["generation-viii"]["sword-shield"].name_icon,
                    }}
                  />
                ))}
              </View>
            </View>
          </View>
          <View style={styles.card}>
            <Text style={[styles.infoText, { fontSize: 16 }]}>Stats:</Text>
            {pokemonDetails.stats.map((item: any) => (
              <View key={item.stat.name}>
                <Text style={styles.infoText}>
                  {item.stat.name}: {item.base_stat}
                </Text>
                <View
                  style={{
                    height: 8,
                    width: `${(item.base_stat / maxVal) * 100}%`,
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
          <View style={[styles.card]}>
            <Text style={[styles.infoText, { fontSize: 16 }]}>Evolution Chain:</Text>

            {!evosLoading ? (
              <>
                {pokemonEvos &&
                  pokemonEvos?.chain.evolves_to &&
                  pokemonEvos?.chain.evolves_to.length > 0 ? (

                  <View style={styles.evolutionSection}>
                    {baseEvo && (
                      <Link href={`/(pokemon)/pokemonDetails/${baseNum}`} asChild>
                        <Pressable>
                          <Image
                            source={{ uri: baseEvo }}
                            style={{
                              width: 80,
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
                              <View key={feIndex} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <View key={feIndex} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                  <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <ArrowRight width={24} height={24} />

                                    {/* Level up trigger */}

                                    {/* {firstEvo.evolution_details[0].trigger.name === "level-up" && (
                                      <Text style={[styles.infoText, { fontSize: 9 }]}>{firstEvo.evolution_details[0].trigger.name}</Text>
                                    )} */}

                                    {firstEvo.evolution_details[0].min_level !== null && (
                                      <Text style={[styles.infoText, { fontSize: 10 }]}>
                                        Lvl {firstEvo.evolution_details[0].min_level}
                                      </Text>
                                    )}

                                    {/* Item trigger */}

                                    {firstEvo.evolution_details[0].item !== null && (
                                      <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        {firstEvo.evolution_details[0].item.name === "black-augurite" ? (
                                          <Text style={[styles.infoText, { fontSize: 9, textAlign: 'center' }]}>black{'\n'}augurite</Text>
                                        ) : (
                                          <Image
                                            alt={firstEvo.evolution_details[0].item.name}
                                            source={{
                                              uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${firstEvo.evolution_details[0].item.name}.png`,
                                            }}
                                            style={{ height: 20, width: 20 }}
                                          />)}

                                      </View>
                                    )}

                                    {/* Happiness/Friendship/Affection trigger */}

                                    {!evosLoading &&
                                      firstEvo.evolution_details[0].min_happiness && (
                                        <>
                                          <Heart width={14} height={14} />
                                          <Text style={[styles.infoText, { fontSize: 9 }]}>Happiness</Text>
                                        </>
                                      )}

                                    {firstEvo.evolution_details[0].min_affection && (
                                      <>
                                        <Heart width={14} height={14} />
                                        <Text style={[styles.infoText, { fontSize: 9 }]}>Happiness</Text>
                                      </>
                                    )}

                                    {/* time of day trigger add-on */}

                                    {firstEvo.evolution_details[0].time_of_day &&
                                      <Text style={[styles.infoText, { fontSize: 9 }]}>{firstEvo.evolution_details[0].time_of_day}</Text>
                                    }

                                    {/* Other evo triggers */}

                                    {firstEvo.species.name === "sirfetchd" && (
                                      <Text style={[styles.infoText, { fontSize: 9 }]}>Land 3 crits {'\n'} in 1 battle</Text>
                                    )}

                                    {firstEvo.species.name === "hitmonchan" && (
                                      <Text style={[styles.infoText, { fontSize: 9 }]}>{"def > atk"}</Text>
                                    )}

                                    {firstEvo.species.name === "hitmonlee" && (
                                      <Text style={[styles.infoText, { fontSize: 9 }]}>{"atk > def"}</Text>
                                    )}

                                    {firstEvo.species.name === "hitmontop" && (
                                      <Text style={[styles.infoText, { fontSize: 9 }]}>{"atk = def"}</Text>
                                    )}

                                    {/* Trade Evo Trigger */}

                                    {firstEvo.evolution_details[0].trigger.name === "trade" &&
                                      <Text style={[styles.infoText, { fontSize: 9 }]}>{firstEvo.evolution_details[0].trigger.name}</Text>
                                    }

                                    {/* Level up location Evo Trigger */}

                                    {firstEvo.evolution_details[0].location && (
                                      <View style={{ display: 'flex', alignItems: 'center' }}>
                                        <Text style={[styles.infoText, { fontSize: 9, textAlign: 'center' }]}>{firstEvo.evolution_details[0].location.name}</Text>
                                        {firstEvo.evolution_details[0].held_item && (
                                          <Text style={[styles.infoText, { fontSize: 9 }]}>+ </Text>
                                        )}
                                      </View>
                                    )}

                                    {/* Known Move Type Evo Trigger */}

                                    {firstEvo.evolution_details[0].known_move_type &&
                                      <Text style={[styles.infoText, { fontSize: 9, textAlign: 'center' }]}>knowing {'\n'} {firstEvo.evolution_details[0].known_move_type.name} {'\n'} move</Text>
                                    }

                                    {/* Known Moves Evo Trigger */}

                                    {firstEvo.evolution_details[0].known_move &&
                                      <Text style={[styles.infoText, { fontSize: 9, textAlign: 'center' }]}>knowing {'\n'} {firstEvo.evolution_details[0].known_move.name}</Text>
                                    }

                                    {firstEvo.evolution_details[0].held_item && (
                                      <>
                                        <Text style={[styles.infoText, { fontSize: 9 }]}>+ </Text>
                                        <Image
                                          source={{
                                            uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${firstEvo.evolution_details[0].held_item.name}.png`,
                                          }}
                                          style={{ height: 20, width: 20 }}
                                        />
                                      </>
                                    )}

                                    {/* Party member evo trigger */}

                                    {firstEvo.evolution_details[0].party_species &&
                                      <Text style={[styles.infoText, { fontSize: 9, textAlign: 'center' }]}>+ {'\n'} {firstEvo.evolution_details[0].party_species.name} {'\n'} in team</Text>
                                    }

                                  </View>
                                  {evo1Img[feIndex] && (
                                    <Link href={`/(pokemon)/pokemonDetails/${evo1Num[feIndex]}`} asChild>
                                      <Pressable>
                                        <Image
                                          source={{ uri: evo1Img[feIndex] }}
                                          style={{
                                            width: 80,
                                            height: 80,
                                            padding: 5,
                                            aspectRatio: "1/1",
                                          }}
                                        />
                                      </Pressable>
                                    </Link>
                                  )}
                                </View>

                                {/* second evo starts here */}

                                {pokemonEvos?.chain.evolves_to[feIndex].evolves_to &&
                                  pokemonEvos?.chain.evolves_to[feIndex].evolves_to.length > 0 && (
                                    <View>
                                      {pokemonEvos?.chain.evolves_to[feIndex].evolves_to.map(
                                        (secEvo, seIndex) => (
                                          <View key={seIndex} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>

                                            {/* Level up trigger */}

                                            <View>
                                              {/* {item.evolution_details[0].min_level !== null && ( */}
                                              <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <ArrowRight width={24} height={24} />

                                                {secEvo.evolution_details[feIndex].trigger.name === "level-up" && (
                                                  <Text style={[styles.infoText, { fontSize: 9 }]}>{secEvo.evolution_details[feIndex].trigger.name}</Text>
                                                )}

                                                {secEvo.evolution_details[feIndex].min_level !== null && (
                                                  <Text style={[styles.infoText, { fontSize: 10 }]}>
                                                    Lvl {secEvo.evolution_details[feIndex].min_level}
                                                  </Text>
                                                )}
                                              </View>

                                              {/* Item trigger */}

                                              {secEvo.evolution_details[feIndex].item !== null && (
                                                <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                  {/* <ArrowRight width={24} height={24} /> */}
                                                  {secEvo.evolution_details[feIndex].item.name === "peat-block" ? (
                                                    <Text style={[styles.infoText, { fontSize: 9, textAlign: 'center' }]}>peat{'\n'}block</Text>
                                                  ) : (
                                                    <Image
                                                      source={{
                                                        uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${secEvo.evolution_details[0].item?.name}.png`,
                                                      }}
                                                      style={{ height: 20, width: 20 }}
                                                    />)}
                                                  {/* <Text numberOfLines={1} style={[styles.infoText, { fontSize: 9, position: 'absolute', bottom: "-50%", width: 89, textAlign: 'center' }]}>{item.evolution_details[0].item.name}</Text> */}
                                                </View>
                                              )}

                                              {/* other (WIP) */}

                                              {secEvo.species.name === "annihilape" && (
                                                <View style={{ display: 'flex', alignItems: 'center' }}>
                                                  {/* <ArrowRight width={24} height={24} /> */}
                                                  <Text style={[styles.infoText, { fontSize: 9 }]}>Use Rage {'\n'} Fist x20</Text>
                                                </View>
                                              )}

                                              {/* Happiness trigger */}

                                              {secEvo.evolution_details[feIndex].min_happiness !=
                                                null && (
                                                  <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    {/* <ArrowRight width={24} height={24} /> */}
                                                    <Heart width={14} height={14} />
                                                    <Text style={[styles.infoText, { fontSize: 9 }]}>Happiness</Text>

                                                    {/* Time of day add-on */}

                                                    {secEvo.evolution_details[feIndex].time_of_day && (
                                                      <Text style={[styles.infoText, { fontSize: 9 }]}>{secEvo.evolution_details[seIndex].time_of_day}</Text>
                                                    )}
                                                  </View>
                                                )}

                                              {/* Trade Evo Trigger */}

                                              {secEvo.evolution_details[feIndex].trigger.name === "trade" &&
                                                <View style={{ display: 'flex', alignItems: 'center' }}>
                                                  {/* <ArrowRight width={24} height={24} /> */}
                                                  <Text style={[styles.infoText, { fontSize: 9 }]}>{secEvo.evolution_details[seIndex].trigger.name}</Text>
                                                  {secEvo.evolution_details[feIndex].held_item && (
                                                    <>
                                                      <Text style={[styles.infoText, { fontSize: 9 }]}>+ </Text>
                                                      <Image
                                                        source={{
                                                          uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${secEvo.evolution_details[feIndex].held_item.name}.png`,
                                                        }}
                                                        style={{ height: 20, width: 20 }}
                                                      />
                                                    </>
                                                  )}
                                                </View>
                                              }

                                              {/* Level up location Evo Trigger */}

                                              {secEvo.evolution_details[feIndex].location && (
                                                <View style={{ display: 'flex', alignItems: 'center' }}>
                                                  <Text style={[styles.infoText, { fontSize: 9, textAlign: 'center' }]}>{secEvo.evolution_details[feIndex].trigger.name} {'\n'} {secEvo.evolution_details[feIndex].location.name}</Text>
                                                  {secEvo.evolution_details[feIndex].held_item && (
                                                    <Text style={[styles.infoText, { fontSize: 9 }]}>+ </Text>
                                                  )}
                                                </View>
                                              )}

                                              {/* Known Moves Evo Trigger */}

                                              {secEvo.evolution_details[feIndex].known_move &&
                                                <>
                                                  <Text style={[styles.infoText, { fontSize: 9, textAlign: 'center' }]}>knowing {'\n'} {secEvo.evolution_details[feIndex].known_move.name}</Text>
                                                  {secEvo.evolution_details[feIndex].held_item && (
                                                    <>
                                                      <Text style={[styles.infoText, { fontSize: 9 }]}>+ </Text>
                                                      <Image
                                                        source={{
                                                          uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${secEvo.evolution_details[feIndex].held_item.name}.png`,
                                                        }}
                                                        style={{ height: 20, width: 20 }}
                                                      />
                                                    </>
                                                  )}
                                                </>
                                              }

                                            </View>
                                            {evo2Img[feIndex] && (
                                              <Link href={`/(pokemon)/pokemonDetails/${evo2Num[feIndex]}`} asChild>
                                                <Pressable>
                                                  <Image
                                                    source={{ uri: evo2Img[feIndex] }}
                                                    style={{
                                                      width: 80,
                                                      height: 80,
                                                      padding: 5,
                                                      aspectRatio: "1/1",
                                                    }}
                                                  />
                                                </Pressable>
                                              </Link>
                                            )}
                                          </View>
                                        )
                                      )}
                                    </View>
                                  )}
                              </View>
                            ))}
                        </View>)}
                  </View>
                ) : (
                  <View>
                    <Text style={styles.infoText}>This Pokemon does not evolve.</Text>
                  </View>
                )}
              </>
            ) : (
              <ActivityIndicator size={20} />
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 10,
    margin: 5,
  },
  pokemonName: {
    fontSize: 16,
    fontFamily: "Silkscreen",
    textAlign: "center",
    textTransform: "capitalize",
  },

  infoText: {
    fontFamily: "Silkscreen"
  },

  evolutionSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Details;
