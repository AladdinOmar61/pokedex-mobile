import { View, Text, StyleSheet, Image, useWindowDimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { getPokemonDetails, Pokemon } from "@/api/pokeapi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';

const Details = () => {
  const { width } = useWindowDimensions();

  const { pokemon } = useLocalSearchParams<{ pokemon: string }>();
  const navigation = useNavigation();

  const [pokemonDetails, setPokemonDetails] = useState<Pokemon>();
  const [isFavorited, setIsFavorited] = useState<boolean>(false);

  useEffect(() => {
    const pokeDetails = async () => {
      const pokeDetailsResp = await getPokemonDetails(pokemon!);
      setPokemonDetails(pokeDetailsResp);

      const isFavorite = await AsyncStorage.getItem(`favorite-${pokemon}`);
      setIsFavorited(isFavorite === 'true');
    };
    pokeDetails();
  }, [pokemon]);

  useEffect(() => {
    if (pokemonDetails) {
      navigation.setOptions({
        title:
          pokemonDetails.name.charAt(0).toUpperCase() +
          pokemonDetails.name.slice(1),
        headerTitleAlign: 'center'
      });
    }
  }, [pokemonDetails, navigation])

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text onPress={toggleFavorite}>
          <Ionicons name={isFavorited ? 'star' : 'star-outline'} size={22} color='white' />
        </Text>
      )
    })
  }, [isFavorited])

  const toggleFavorite = async () => {
    await AsyncStorage.setItem(`favorite-${pokemon}`, !isFavorited ? 'true' : 'false');
    setIsFavorited(!isFavorited);
  }

  return (
    <View style={{ padding: 10 }}>
      {pokemonDetails && (
        <>
          <View style={styles.card}>
            <Text style={styles.pokemonName}>#{pokemonDetails.id} {pokemonDetails.name}</Text>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
              <Image
                source={{ uri: pokemonDetails.sprites.front_default }}
                style={{ width: width / 2.33, height: 200, padding: 5, aspectRatio: "1/1" }}
              />
              <Image
                source={{ uri: pokemonDetails.sprites.front_shiny }}
                style={{ width: width / 2.33, height: 200, padding: 5, aspectRatio: "1/1" }}
              />
            </View>
          </View>
          <View style={styles.card}>
            <Text style={{ fontSize: 16 }}>Stats:</Text>
            {pokemonDetails.stats.map((item: any) => (
              <Text key={item.stat.name}>{item.stat.name}: {item.base_stat}</Text>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 10,
    margin: 5
  },
  pokemonName: {
    fontSize: 20,
    textAlign: 'center',
    textTransform: 'capitalize'
  }
});

export default Details;
