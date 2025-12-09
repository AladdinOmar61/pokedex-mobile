import { View, Text, TouchableOpacity, StyleSheet, Image, VirtualizedList } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useLocalSearchParams, useNavigation } from 'expo-router'
import { SimpleSpecies } from '@/interface';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import pokeApi from '@/api/pokeapi';
import ForwardChev from "@/assets/Icons/Forward-Chevron.svg";
import { LinearGradient } from 'expo-linear-gradient';
import { PokeTypeColor } from '@/PokeTypeColor';
import { PokeTypeIcon } from '@/PokeTypeIcon';
import { FlashList } from "@shopify/flash-list";
import { NamedAPIResource, Pokemon, PokemonSpecies, PokemonSprites, PokemonType } from 'pokenode-ts';
import pLimit from "p-limit";

const AllPokemon = () => {

    const { gen } = useLocalSearchParams<{ gen: string }>();

    const {
        getAllPokemonFromGen,
    } = pokeApi();

    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const limit = pLimit(8);

    const [genPokemon, setGenPokemon] = useState<Pokemon[]>([]);
    const [pokemonLoaded, setPokemonLoaded] = useState<boolean>(true);

    const getItem = (data: typeof genPokemon, index: number) => data[index];

    useEffect(() => {
        const retrievePokemonFromGen = async () => {
            try {
                setPokemonLoaded(true);
                const genPokeResp = await getAllPokemonFromGen(Number(gen) - 1);
                const sortedPokemon = genPokeResp.sort((a, b) => a.id - b.id);

                sortedPokemon.forEach((pokemon, index) => {
                    setTimeout(() => {
                        setGenPokemon(prev => [...prev, pokemon]);
                    }, index * 10) //10 ms between renders
                });
                setPokemonLoaded(false);
            } catch (err: any) {
                console.error('axios error:', err.response?.status, err.response?.data);
                console.error('requested url:', err.config?.url);
                console.error("Could not retrieve pokemon", err);
            }
        }
        retrievePokemonFromGen();
    }, [gen])

    useEffect(() => {
        if (genPokemon) {
            navigation.setOptions({
                title: `Generation ${Number(gen) - 1}`,
                headerTitleStyle: { fontFamily: "Silkscreen", fontSize: 16 },
                headerTitleAlign: 'center'
            });
        }
    }, [genPokemon, navigation])

    const ItemRow = React.memo(({ item }: { item: Pokemon }) => (
        <Link href={`/(pokemon)/pokemonDetails/${item.name ? item.name : item.forms[0].name}`} asChild>
            <TouchableOpacity>
                <LinearGradient style={{ width: "100%", zIndex: -10 }} start={{ x: 0.1, y: 0 }} colors={PokeTypeColor(item.types[0].type.name)}>
                    <View style={styles.item}>
                        {PokeTypeIcon(item.types[0].type.name)}
                        {item.sprites &&
                            <Image source={{ uri: item.sprites.front_default! }} style={styles.preview} />
                        }
                        <Text style={[styles.itemText]}>#{item.id} {item.name ? item.name : item.forms[0].name}</Text>
                        <ForwardChev width={8} height={14} style={{ marginRight: 15 }} />
                    </View>
                </LinearGradient>
            </TouchableOpacity>
                    </Link > 
    ));

    const renderItem = useCallback(({ item }: { item: Pokemon }) => <ItemRow item={item} />, [])

    return (
        <VirtualizedList
            style={{ marginBottom: insets.bottom }}
            initialNumToRender={7}
            maxToRenderPerBatch={7}
            windowSize={2}
            updateCellsBatchingPeriod={50}
            data={genPokemon}
            getItemCount={(data) => data.length}
            getItem={getItem}
            keyExtractor={(item) => String(item?.id || 'unknown')}
            renderItem={renderItem} />)
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