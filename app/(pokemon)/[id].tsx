import { View, Text, StyleSheet, Image, useWindowDimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { getPokemonDetails, Pokemon } from "@/api/pokeapi";

const Details = () => {
  const {width, height} = useWindowDimensions();

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
    navigation.setOptions({
      title:
        pokemonDetails.name.charAt(0).toUpperCase() +
        pokemonDetails.name.slice(1),
    });
  };

  useEffect(() => {
    pokeDetails();
  }, [id]);

  return (
    <View style={{ padding: 10 }}>
      {pokemonDetails && (
        <>
          <View style={[styles.card, {display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}]}>
            <Image
              source={{ uri: pokemonDetails.sprites.front_default }}
              style={{ width: width / 2.33, height: 200, padding: 5 }}
            />
            <Image
              source={{ uri: pokemonDetails.sprites.front_shiny }}
              style={{ width: width / 2.33, height: 200, padding: 5 }}
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
    backgroundColor: '#fff',
    padding: 10,
  },
});

export default Details;
