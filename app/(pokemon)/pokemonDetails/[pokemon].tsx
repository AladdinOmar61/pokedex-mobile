import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Pokemon, Generation, Chain } from "@/api/pokeapi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import pokeApi from "@/api/pokeapi";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Details = () => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const { getPokemonDetails, getPokemonType, getEvolutions } = pokeApi();

  const { pokemon } = useLocalSearchParams<{ pokemon: string }>();
  const navigation = useNavigation();

  const [pokemonDetails, setPokemonDetails] = useState<Pokemon>();
  const [pokemonEvos, setPokemonEvos] = useState<Chain>();
  const [baseEvo, setBaseEvo] = useState<string>("");
  const [evo1Img, setEvo1Img] = useState<string[]>([]);
  const [evo2Img, setEvo2Img] = useState<string[]>([]);
  const [evosLoading, setEvosLoading] = useState<boolean>(true);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [pokemonType, setPokemonType] = useState<Generation[]>([]);

  const maxVal = 255;

  useEffect(() => {
    const pokeDetails = async () => {
      const pokeDetailsResp = await getPokemonDetails(pokemon!);
      setPokemonDetails(pokeDetailsResp);

      const isFavorite = await AsyncStorage.getItem(`favorite-${pokemon}`);
      setIsFavorited(isFavorite === "true");
    };
    pokeDetails();
  }, [pokemon]);

  useEffect(() => {
    setEvosLoading(true);
    const pokeEvos = async () => {
      const evos = await getEvolutions(pokemon!);
      console.log("do we get here?");
      setPokemonEvos(evos.chain);
      setEvosLoading(false);
    };
    pokeEvos();
  }, []);

  useEffect(() => {
    if (pokemonEvos) {
      const speciesUrl = pokemonEvos?.species.url.match(/\/(\d+)\/$/);
      const speciesNum = speciesUrl ? speciesUrl[1] : null;
      const speciesImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${speciesNum}.png`;
      setBaseEvo(speciesImg); //undefined for legends
      let evosBucket = [];
      let secondEvosBucket = [];
      if (pokemonEvos.evolves_to.length > 0) {
        console.log("loop running?");
        for (let i = 0; i < pokemonEvos.evolves_to.length; i++) {
          const speciesUrl =
            pokemonEvos?.evolves_to[i].species.url.match(
              /\/(\d+)\/$/
            );
          const speciesNum = speciesUrl ? speciesUrl[1] : null;
          const speciesImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${speciesNum}.png`;
          evosBucket.push(speciesImg);
        }
        setEvo1Img(evosBucket);
        if (pokemonEvos.evolves_to[0].evolves_to.length > 0) {
          for (let i = 0; i < pokemonEvos.evolves_to[0].evolves_to.length; i++) {
            const speciesUrl =
              pokemonEvos?.evolves_to[0].evolves_to[i].species.url.match(
                /\/(\d+)\/$/
              );
            const speciesNum = speciesUrl ? speciesUrl[1] : null;
            const speciesImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${speciesNum}.png`;
            secondEvosBucket.push(speciesImg);
          }
          setEvo2Img(secondEvosBucket);
        }
      }
    }
  }, [pokemonEvos]);

  useEffect(() => {
    if (pokemonDetails) {
      navigation.setOptions({
        title:
          pokemonDetails.name.charAt(0).toUpperCase() +
          pokemonDetails.name.slice(1),
        headerTitleAlign: "center",
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
                source={{ uri: pokemonDetails.sprites.front_default }}
                style={{
                  width: width / 2.33,
                  height: 200,
                  padding: 5,
                  aspectRatio: "1/1",
                }}
              />
              <Image
                source={{ uri: pokemonDetails.sprites.front_shiny }}
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
                    style={{ width: 60, height: 20 }}
                    source={{
                      uri:
                        item &&
                        (item as any)["generation-v"]["black-white"].name_icon,
                    }}
                  />
                ))}
              </View>
            </View>
          </View>
          <View style={styles.card}>
            <Text style={{ fontSize: 16 }}>Stats:</Text>
            {pokemonDetails.stats.map((item: any) => (
              <View key={item.stat.name}>
                <Text>
                  {item.stat.name}: {item.base_stat}
                </Text>
                <View
                  style={{
                    height: 5,
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
          <View style={[styles.card, { width: "100%" }]}>
            <Text style={{ fontSize: 16 }}>Evolution Chain:</Text>

            {!evosLoading ? (
              <>
                {pokemonEvos &&
                  pokemonEvos?.evolves_to &&
                  pokemonEvos?.evolves_to.length > 0 ? (

                  <View style={styles.evolutionSection}>
                    {baseEvo && (
                      <Image
                        source={{ uri: baseEvo }}
                        style={{
                          width: 100,
                          height: 100,
                          padding: 5,
                          aspectRatio: "1/1",
                        }}
                      />
                    )}

                    {/* first evo starts here  */}


                    {pokemonEvos?.evolves_to &&
                      pokemonEvos?.evolves_to.length > 0 && (
                        <View>
                          {pokemonEvos?.evolves_to.map(
                            (item, index) => (
                              <View key={index} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <View>
                                  <Ionicons name="arrow-forward" size={20} />
                                  {item.evolution_details[0].min_level !== null && (
                                    <Text>
                                      Lvl {item.evolution_details[0].min_level}
                                    </Text>
                                  )}
                                  {item.evolution_details[0].item !== null && (
                                    <Image
                                      source={{
                                        uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.evolution_details[0].item.name}.png`,
                                      }}
                                      style={{ height: 20, width: 20 }}
                                    />
                                  )}
                                  {!evosLoading &&
                                    item.evolution_details[0].min_happiness !=
                                    null && (
                                      <Ionicons
                                        name="heart"
                                        color={"red"}
                                        size={15}
                                      />
                                    )}
                                </View>
                                {evo1Img[index] && (
                                  <Image
                                    source={{ uri: evo1Img[index] }}
                                    style={{
                                      width: 100,
                                      height: 100,
                                      padding: 5,
                                      aspectRatio: "1/1",
                                    }}
                                  />
                                )}
                              </View>
                            )
                          )}
                        </View>)}


                    {/* second evo starts here */}

                    {pokemonEvos?.evolves_to[0].evolves_to &&
                      pokemonEvos?.evolves_to[0].evolves_to.length > 0 && (
                        <View>
                          {pokemonEvos?.evolves_to[0].evolves_to.map(
                            (item, index) => (
                              <View key={index} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <View>
                                  <Ionicons name="arrow-forward" size={20} />
                                  {item.evolution_details[0].min_level !== null && (
                                    <Text>
                                      Lvl {item.evolution_details[0].min_level}
                                    </Text>
                                  )}
                                  {item.evolution_details[0].item !== null && (
                                    <Image
                                      source={{
                                        uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.evolution_details[0].item.name}.png`,
                                      }}
                                      style={{ height: 20, width: 20 }}
                                    />
                                  )}
                                  {item.species.name === "annihilape" && (
                                    <>
                                      <Ionicons name="help" size={18} color={"white"} style={{ borderColor: 'black', borderWidth: 1, borderRadius: 5, backgroundColor: 'red' }} />
                                    </>
                                  )}
                                  {!evosLoading &&
                                    item.evolution_details[0].min_happiness !=
                                    null && (
                                      <Ionicons
                                        name="heart"
                                        color={"red"}
                                        size={15}
                                      />
                                    )}
                                </View>
                                {evo2Img[index] && (
                                  <Image
                                    source={{ uri: evo2Img[index] }}
                                    style={{
                                      width: 100,
                                      height: 100,
                                      padding: 5,
                                      aspectRatio: "1/1",
                                    }}
                                  />
                                )}
                              </View>
                            )
                          )}
                        </View>
                      )}
                  </View>
                ) : (
                  <View>
                    <Text>This Pokemon does not evolve.</Text>
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
    fontSize: 20,
    textAlign: "center",
    textTransform: "capitalize",
  },
  evolutionSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Details;
