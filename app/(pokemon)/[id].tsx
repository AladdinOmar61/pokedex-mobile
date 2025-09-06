import { View, Text, StyleSheet, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { getPokemonDetails, Pokemon } from "@/api/pokeapi";

const Details = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  const [pokemonDetails, setPokemonDetails] = useState<Pokemon>({
    name: "",
    url: "",
    id: 0,
    image: "",
    sprites: "",
    abilities: null,
    stats: null,
  });

  const pokeDetails = async () => {
    const pokeDetailsResp = await getPokemonDetails(id!);
    setPokemonDetails(pokeDetailsResp);
    if (pokemonDetails) {
      navigation.setOptions({
        title:
          pokemonDetails.name.charAt(0).toUpperCase() +
          pokemonDetails.name.slice(1),
        headerTitleAlign: 'center'
      });
    }
  };

  useEffect(() => {
    pokeDetails();
  }, [pokemonDetails, id]);

  return (
    <View style={{ padding: 10 }}>
      {pokemonDetails && (
        <>
          <View style={[styles.card, {display: 'flex', flexDirection: 'row', justifyContent: 'center'}]}>
            <Image
              source={{ uri: pokemonDetails.sprites.front_default }}
              style={{ width: 200, height: 200 }}
            />
            <Image
              source={{ uri: pokemonDetails.sprites.front_shiny }}
              style={{ width: 200, height: 200 }}
            />
          </View>
          <View style={styles.card}></View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
    margin: 10,
  },
});

export default Details;
