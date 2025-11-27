import {
  View,
  Text,
  ScrollView,
  Touchable,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import { Pokemon } from "@/api/pokeapi";
import { Ionicons } from "@expo/vector-icons";
import pokeApi from "@/api/pokeapi";

const AllPokemon = () => {
  const { getPokemon } = pokeApi();

  const [pokemon, setPokemon] = useState<Pokemon[]>([]);

  const retrievePokemon = async () => {
    try {
      const pokeResp = await getPokemon();
      setPokemon(pokeResp);
    } catch (err) {
      console.error("Could not retrieve pokemon", err);
    }
  };

  useEffect(() => {
    retrievePokemon();
  }, []);

  return (
    <ScrollView>
      {pokemon ? (
        pokemon.map((p) => (
          <Link href={`/(pokemon)/pokemonDetails/${p.id}`} key={p.id} asChild>
            <TouchableOpacity>
              <View style={styles.item}>
                <Image source={{ uri: p.image }} style={styles.preview} />
                <Text style={styles.itemText}>
                  #{p.id} {p.name}
                </Text>
                <Ionicons name="chevron-forward" size={24} />
              </View>
            </TouchableOpacity>
          </Link>
        ))
      ) : (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator color={"#F4511E"} size={24} />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "black",
  },
  preview: {
    width: 100,
    height: 100,
  },
  itemText: {
    fontSize: 18,
    fontFamily: "Silkscreen",
    textTransform: "capitalize",
    flex: 1,
  },
});

export default AllPokemon;
