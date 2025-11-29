import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link, useLocalSearchParams, useNavigation } from 'expo-router'
import { GenPokemonEntry } from '@/api/pokeapi'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import pokeApi from '@/api/pokeapi';
import ForwardChev from "@/assets/Icons/Forward-Chevron.svg";
import GrassType from "@/assets/Icons/pokeTypes/Grass.svg";
import { LinearGradient } from 'expo-linear-gradient';
import { PokemonClient } from 'pokenode-ts';
import { PokeTypeColor } from '@/PokeTypeColor';
import { PokeTypeIcon } from '@/PokeTypeIcon';

const AllPokemon = () => {

    const { gen } = useLocalSearchParams<{ gen: string }>();

    const {
        getAllPokemonFromGen
    } = pokeApi();

    const navigation = useNavigation();
    const insets = useSafeAreaInsets();


    const [genPokemon, setGenPokemon] = useState<GenPokemonEntry[]>([]);

    const getPokemonsFirstType = async (pokemonName: string) => {
        try {
            const api = new PokemonClient();
            const data = await api.getPokemonByName(pokemonName)
            return data.types[0].type.name;
        } catch (error) { console.error(error) };
    };

    const getPokemonsSecondType = async (pokemonName: string) => {
        try {
            const api = new PokemonClient();
            const data = await api.getPokemonByName(pokemonName)
            if (data.types[1]) {
                return data.types[1].type.name;
            }
        } catch (error) { console.error(error) };
    };

    const retrievePokemonFromGen = async () => {
        try {
            const genPokeResp = await getAllPokemonFromGen(gen!);
            const enriched = await Promise.all(
                genPokeResp.map(async (p: any) => {
                    const firstType = await getPokemonsFirstType(p.name);
                    const secondType = await getPokemonsSecondType(p.name);
                    return {
                        ...p,
                        image: p.image, // or compute from ID if needed
                        firstType: firstType ?? 'normal',
                        secondType: secondType ?? 'normal'
                    } as GenPokemonEntry;
                })
            );
            setGenPokemon(enriched);
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
                headerTitleStyle: { fontFamily: "Silkscreen", fontSize: 16 },
                headerTitleAlign: 'center'
            });
        }
    }, [genPokemon, navigation])

    return (
        <ScrollView style={{ marginBottom: insets.bottom }}>
            {genPokemon ? (

                genPokemon.map((p) => {
                    let extractedNum = p.url.match(/\/(\d+)\/$/);
                    let finalNum = extractedNum ? extractedNum[1] : null;
                    return (
                        <Link href={`/(pokemon)/pokemonDetails/${finalNum}`} key={finalNum} asChild>
                            <TouchableOpacity>
                                <LinearGradient style={{ width: "100%" }} start={{ x: 0.1, y: 0 }} colors={PokeTypeColor(p.firstType ?? 'normal')}>
                                    <View style={styles.item}>
                                        {/* <GrassType width={100} height={100} style={{ position: 'absolute', right: '3%' }} /> */}
                                        {PokeTypeIcon(p.firstType ?? 'normal')}
                                        <Image source={{ uri: p.image }} style={styles.preview} />
                                        <Text style={styles.itemText}>#{finalNum} {p.name}</Text>
                                        <ForwardChev width={8} height={14} style={{ width: 8, height: 14, marginRight: 15 }} />
                                    </View>
                                </LinearGradient>
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
        color: 'black',
        fontFamily: "Silkscreen",
        textTransform: 'capitalize',
        flex: 1
    }
})

export default AllPokemon