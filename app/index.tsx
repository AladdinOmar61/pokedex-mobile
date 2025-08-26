import { View, Text, ScrollView, Touchable, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link } from 'expo-router'
import { getPokemon, Pokemon } from '@/api/pokeapi'
import { Ionicons } from '@expo/vector-icons';

const Home = () => {

  const [pokemon, setPokemon] = useState<Pokemon[]>([]);

  const retrievePokemon = async () => {
    try {
      const pokeResp = await getPokemon();
      setPokemon(pokeResp);
    } catch (err) {
      console.error("Could not retrieve pokemon", err);
    }
  }

  useEffect(() => {
    retrievePokemon();
  }, [])

  return (
    <ScrollView>
      {pokemon.map((p) => (
        <Link href={`/(pokemon)/${p.id}`} asChild>
          <TouchableOpacity>
            <View style={styles.item}>
              <Image source={{uri: p.image}} style={styles.preview} />
              <Text style={styles.itemText}>{p.name}</Text>
              <Ionicons name='chevron-forward' size={24} />
            </View>
          </TouchableOpacity>
        </Link>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  item: {
    padding: 10,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: {
    width: 100,
    height: 100
  },
  itemText: {
    fontSize: 18,
    textTransform: 'capitalize',
    flex: 1
  }
})

export default Home