import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link, useLocalSearchParams, useNavigation } from 'expo-router'
import { NamedAPIResource, PokemonSpecies, PokemonSpeciesVariety } from '@/interface';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import pokeApi from '@/api/pokeapi';
import ForwardChev from "@/assets/Icons/Forward-Chevron.svg";
import { LinearGradient } from 'expo-linear-gradient';
import { PokemonClient } from 'pokenode-ts';
import { PokeTypeColor } from '@/PokeTypeColor';
import { PokeTypeIcon } from '@/PokeTypeIcon';

const AllPokemon = () => {

    const { gen } = useLocalSearchParams<{ gen: string }>();

    // console.log("generation endpoint: ", gen);

    const {
        getAllPokemonFromGen
    } = pokeApi();

    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const [genPokemon, setGenPokemon] = useState<PokemonSpecies[]>([]);

    // const getPokemonsFirstType = async (pokemonId: string) => {
    //     try {
    //         const api = new PokemonClient();
    //         const data = await api.getPokemonByName(pokemonId)
    //         // console.log(pokemonName);
    //         console.log(data.types[0].type.name);
    //         return data.types[0].type.name;
    //     } catch (error) { console.error("pokemon type 1 error: ", error) };
    // };

    // const getPokemonsSecondType = async (pokemonId: string) => {
    //     try {
    //         const api = new PokemonClient();
    //         const data = await api.getPokemonByName(pokemonId)
    //         if (data.types[1]) {
    //             return data.types[1].type.name;
    //         }
    //     } catch (error) { console.error("pokemon type 2 error: ", error) };
    // };

    const retrievePokemonFromGen = async () => {
        try {
            const genPokeResp = await getAllPokemonFromGen(Number(gen) - 1);
            // console.log(genPokeResp);
            // const enriched = await Promise.all(
            //     genPokeResp.map(async (p: any) => {
            //         const firstType = await getPokemonsFirstType(p.id);
            //         const secondType = await getPokemonsSecondType(p.id);
            //         return {
            //             ...p,
            //             image: p.image, // or compute from ID if needed
            //             firstType: firstType ?? 'normal',
            //             secondType: secondType ?? 'normal'
            //         } as PokemonEntry;
            //     })
            // );
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
                title: `Generation ${Number(gen)-1}`,
                headerTitleStyle: { fontFamily: "Silkscreen", fontSize: 16 },
                headerTitleAlign: 'center'
            });
        }
    }, [genPokemon, navigation])

    return (
        <ScrollView style={{ marginBottom: insets.bottom }}>
            {genPokemon ? (

                genPokemon.map((p, index) => {
                    return (
                        <Link href={`/(pokemon)/pokemonDetails/${p.varieties[0].pokemon.name}`} key={index} asChild>
                            <TouchableOpacity>
                                {/* <LinearGradient style={{ width: "100%" }} start={{ x: 0.1, y: 0 }} colors={PokeTypeColor(p.firstType === "normal" && p.secondType === "flying" ? p.secondType : p.firstType ?? 'normal')}> */}
                                    <View style={styles.item}>
                                        {/* <GrassType width={100} height={100} style={{ position: 'absolute', right: '3%' }} /> */}
                                        {/* {PokeTypeIcon(p.firstType === "normal" && p.secondType === "flying" ? p.secondType : p.firstType ?? 'normal')} */}
                                        <Image source={{ uri: p.image }} style={styles.preview} />
                                        <Text style={styles.itemText}>#{index+1} {p.varieties[0].pokemon.name}</Text>
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