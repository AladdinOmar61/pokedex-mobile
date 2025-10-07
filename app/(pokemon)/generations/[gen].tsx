import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link, useLocalSearchParams, useNavigation } from 'expo-router'
import { GenPokemonEntry } from '@/api/pokeapi'
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import pokeApi from '@/api/pokeapi';

const AllPokemon = () => {

    const { gen } = useLocalSearchParams<{ gen: string }>();

    const {
        getAllPokemonFromGen
    } = pokeApi();

    const navigation = useNavigation();
    const insets = useSafeAreaInsets();


    const [genPokemon, setGenPokemon] = useState<GenPokemonEntry[]>([]);

    const retrievePokemonFromGen = async () => {
        try {
            const genPokeResp = await getAllPokemonFromGen(gen!);
            setGenPokemon(genPokeResp);
        } catch (err) {
            console.error("Could not retrieve pokemon", err);
        }
    }

    useEffect(() => {
        retrievePokemonFromGen();
    }, [])

    useEffect(() => {
        if (genPokemon) {
          navigation.setOptions({
            title: `Generation ${gen}`,
            headerTitleAlign: 'center'
          });
        }
    }, [genPokemon, navigation])

    return (
        <ScrollView style={{marginBottom: insets.bottom}}>
            {genPokemon ? (

                genPokemon.map((p) => {
                    let extractedNum = p.url.match(/\/(\d+)\/$/);
                    let finalNum = extractedNum ? extractedNum[1] : null;
                    
                    return (
                        <Link href={`/(pokemon)/pokemonDetails/${finalNum}`} key={finalNum} asChild>
                            <TouchableOpacity>
                                <View style={styles.item}>
                                    <Image source={{ uri: p.image }} style={styles.preview} />
                                    <Text style={styles.itemText}>#{finalNum} {p.name}</Text>
                                    <Ionicons name='chevron-forward' size={24} />
                                </View>
                            </TouchableOpacity>
                        </Link>
                    )
                })
            ) : (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator color={"#F4511E"} size={24} />
                </View>
            )
            }
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
        borderBottomWidth: 0.5,
        borderBottomColor: 'black',
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

export default AllPokemon