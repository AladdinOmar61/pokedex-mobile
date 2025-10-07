import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
  ActivityIndicator
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Pokemon, Generation, Chain } from "@/api/pokeapi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import pokeApi from "@/api/pokeapi";

const Details = () => {
  const { width } = useWindowDimensions();

  const { getPokemonDetails, getPokemonType, getEvolutions } = pokeApi();

  const { pokemon } = useLocalSearchParams<{ pokemon: string }>();
  const navigation = useNavigation();

  const [pokemonDetails, setPokemonDetails] = useState<Pokemon>();
  const [pokemonEvos, setPokemonEvos] = useState<Chain>();
  const [baseEvo, setBaseEvo] = useState<string>("");
  const [evo1Img, setEvo1Img] = useState<string>("");
  const [evo2Img, setEvo2Img] = useState<string>("");
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
    const pokeEvos = async () => {
      const evos = await getEvolutions(pokemon!);
      setPokemonEvos(evos.chain);
    };
    pokeEvos();
  }, []);

  useEffect(() => {
    if (pokemonEvos) {
      const speciesUrl = pokemonEvos?.species.url.match(/\/(\d+)\/$/);
      const speciesNum = speciesUrl ? speciesUrl[1] : null;
      const speciesImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${speciesNum}.png`;
      setBaseEvo(speciesImg);
      if (pokemonEvos.evolves_to.length > 0) {
        const speciesUrl =
          pokemonEvos?.evolves_to[0].species.url.match(/\/(\d+)\/$/);
        const speciesNum = speciesUrl ? speciesUrl[1] : null;
        const speciesImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${speciesNum}.png`;
        setEvo1Img(speciesImg);
      }
      if (pokemonEvos.evolves_to[0].evolves_to.length > 0) {
        const speciesUrl =
          pokemonEvos?.evolves_to[0].evolves_to[0].species.url.match(
            /\/(\d+)\/$/
          );
        const speciesNum = speciesUrl ? speciesUrl[1] : null;
        const speciesImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${speciesNum}.png`;
        setEvo2Img(speciesImg);
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
    <View style={{ padding: 10 }}>
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
                      uri: item && (item as any)["generation-v"]["black-white"]
                        .name_icon,
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
          <View style={[styles.card, {width: '100%'}]}>
            <Text style={{ fontSize: 16 }}>Evolution Chain:</Text>
            {baseEvo && baseEvo !== "" && evo1Img && evo1Img !== "" && evo2Img && evo2Img !== "" ? (
            <View style={styles.evolutionSection}>
              <Image
                source={{ uri: baseEvo && baseEvo }}
                style={{
                  width: 100,
                  height: 100,
                  padding: 5,
                  aspectRatio: "1/1",
                }}
              />
              <View style={{ display: "flex", alignItems: "center" }}>
                <Ionicons name="arrow-forward" size={20} />
                {pokemonEvos?.evolves_to[0].evolution_details[0].min_level && (
                  <Text>
                    Lvl{" "}
                    {pokemonEvos.evolves_to[0].evolution_details[0].min_level}
                  </Text>
                )}
              </View>
              <Image
                source={{ uri: evo1Img && evo1Img }}
                style={{
                  width: 100,
                  height: 100,
                  padding: 5,
                  aspectRatio: "1/1",
                }}
              />
              {pokemonEvos?.evolves_to[0].evolves_to && pokemonEvos?.evolves_to[0].evolves_to.length > 0 && (
                <>
                <View style={{ display: "flex", alignItems: "center" }}>
                  <Ionicons name="arrow-forward" size={20} />
                  <Text>
                    Lvl{" "}
                    {
                      pokemonEvos?.evolves_to[0].evolves_to[0]
                        .evolution_details[0].min_level
                    }
                  </Text>
                </View>

                <Image
                source={{ uri: evo2Img && evo2Img }}
                style={{
                  width: 100,
                  height: 100,
                  padding: 5,
                  aspectRatio: "1/1",
                }}
              />
              </>
              )}
              
            </View>
            ) : 
            <ActivityIndicator />
            }
          </View>
        </>
      )}
    </View>
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
