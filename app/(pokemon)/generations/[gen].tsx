import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link, useLocalSearchParams, useNavigation } from 'expo-router'
import { NamedAPIResource, PokemonSpecies, PokemonSpeciesVariety, SimpleSpecies } from '@/interface';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import pokeApi from '@/api/pokeapi';
import ForwardChev from "@/assets/Icons/Forward-Chevron.svg";
import { LinearGradient } from 'expo-linear-gradient';
import { PokemonClient } from 'pokenode-ts';
import { PokeTypeColor } from '@/PokeTypeColor';
import { PokeTypeIcon } from '@/PokeTypeIcon';

const AllPokemon = () => {

    const { gen } = useLocalSearchParams<{ gen: string }>();

    // (async () => {
    //     const api = new PokemonClient();

    //     await api
    //         .getPokemonSpeciesById(151)
    //         .then((data) => console.log(data))
    //         .catch((error) => console.error(error));
    // })();

    const {
        getAllPokemonFromGen
    } = pokeApi();

    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const [genPokemon, setGenPokemon] = useState<SimpleSpecies[]>([]);

    const retrievePokemonFromGen = async () => {
        try {
            const genPokeResp = await getAllPokemonFromGen(Number(gen) - 1);
            const filteredPokemon = genPokeResp.filter((pokemn) => pokemn.id !== undefined)
            setGenPokemon(filteredPokemon);
        } catch (err: any) {
            console.error('axios error:', err.response?.status, err.response?.data);
            console.error('requested url:', err.config?.url);
            console.error("Could not retrieve pokemon", err);
        }
    }

    useEffect(() => {
        retrievePokemonFromGen();
    }, [])

    useEffect(() => {
        if (genPokemon) {
            navigation.setOptions({
                title: `Generation ${Number(gen) - 1}`,
                headerTitleStyle: { fontFamily: "Silkscreen", fontSize: 16 },
                headerTitleAlign: 'center'
            });
        }
    }, [genPokemon, navigation])

    return (
        <ScrollView style={{ marginBottom: insets.bottom }}>
            {genPokemon ? (

                genPokemon.map((p, index) => {
                    const pokemonName = p.varieties?.[0]?.pokemon?.name ?? p.name;
                    console.log(p)
                    return (
                        <Link href={`/(pokemon)/pokemonDetails/${pokemonName}`} key={index} asChild>
                            <TouchableOpacity>
                                {/* <LinearGradient style={{ width: "100%" }} start={{ x: 0.1, y: 0 }} colors={PokeTypeColor(p.firstType === "normal" && p.secondType === "flying" ? p.secondType : p.firstType ?? 'normal')}> */}
                                <View style={styles.item}>
                                    {/* <GrassType width={100} height={100} style={{ position: 'absolute', right: '3%' }} /> */}
                                    {/* {PokeTypeIcon(p.firstType === "normal" && p.secondType === "flying" ? p.secondType : p.firstType ?? 'normal')} */}
                                    <Image source={{ uri: p.image }} style={styles.preview} />
                                    <Text style={styles.itemText}>#{p.id} {pokemonName}</Text>
                                    <ForwardChev width={8} height={14} style={{ width: 8, height: 14, marginRight: 15 }} />
                                </View>
                                {/* </LinearGradient> */}
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
        color: '#000000',
        fontFamily: "Silkscreen",
        textTransform: 'capitalize',
        flex: 1,
        zIndex: 10
    }
})

export default AllPokemon