import { View, Text, TouchableOpacity, StyleSheet, Image, useWindowDimensions } from 'react-native'
import React, { useEffect } from 'react'
import { Link, useLocalSearchParams, useNavigation } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import pokeApi from '@/api/pokeapi';
import ForwardChev from "@/assets/Icons/Forward-Chevron.svg";
import { LinearGradient } from 'expo-linear-gradient';
import { PokeTypeColor } from '@/PokeTypeColor';
import { PokeTypeIcon } from '@/PokeTypeIcon';
import { FlashList } from "@shopify/flash-list";
import { useQuery } from '@tanstack/react-query';

const AllPokemon = () => {

    const { gen } = useLocalSearchParams<{ gen: string }>();
    const { width, height } = useWindowDimensions();

    const {
        getAllPokemonFromGen,
    } = pokeApi();

    const {data: genPokemon, isLoading, error } = useQuery({
        queryKey: ["gen", gen],
        queryFn: () => getAllPokemonFromGen(Number(gen)-1)
    })

    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

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
        <View style={{ height: height - (insets.bottom + insets.top), width: width }}>
            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {/* TODO: Add spinning pokeball loading animation */ }
                    <Text style={{ fontFamily: "Silkscreen" }}>Loading...</Text>
                </View>
            ) : (
                <FlashList
                    style={{ marginBottom: insets.bottom, height: '100%', width: '100%' }}
                    data={genPokemon}
                    keyExtractor={(item) => String(item?.id || 'unknown')}
                    renderItem={({ item, index }) => (
                        <Link href={`/(pokemon)/pokemonDetails/${item.name}`} key={index} asChild>
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
                        </Link>
                    )} />)}
        </View>)
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