import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import pokeApi, { SinglePokemon } from '@/api/pokeapi';
import ForwardChev from '@/assets/Icons/Forward-Chevron.svg';
import { LinearGradient } from 'expo-linear-gradient';
import { PokeTypeColor } from '@/PokeTypeColor';
import { Link } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PokeTypeIcon } from '@/PokeTypes';
import { searchAtom } from '@/atoms';
import { useAtom } from 'jotai';

const index = () => {
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const [searchText] = useAtom(searchAtom);

    const [searchResults, setSearchResults] = useState<SinglePokemon[]>([]);

    const { getPokemon } = pokeApi();

    const { data: allPokemon, isLoading: resultLoading, error: searchErr } = useQuery({
        queryKey: ["allPokemon"],
        queryFn: () => getPokemon(),
        meta: {
            persist: true,
        },
    })

    useEffect(() => {
        const handleSearch = () => {
            if (searchText.length > 2) {
                const filteredPokemon = allPokemon?.filter((pkm) => pkm.name.includes(searchText.toLocaleLowerCase()));
                setSearchResults(filteredPokemon!);
            } else {
                setSearchResults([]);
            }
        }
        handleSearch();
    }, [searchText])


    const readableColor = (pokemonType: string) => {
        if (
            pokemonType === "normal" ||
            pokemonType === "bug" ||
            pokemonType === "grass" ||
            pokemonType === "flying" ||
            pokemonType === "electric" ||
            pokemonType === "rock"
        ) {
            return "black";
        } else {
            return "white";
        }
    };

    return (
        <View
            style={{ height: height - (insets.bottom + insets.top), width: width }}
        >
            {searchErr && (
                <View>
                    <Text style={{ fontFamily: "Silkscreen" }}>
                        Oops! Something went wrong. Leave the page or app and try again
                    </Text>
                </View>
            )}
            {resultLoading && (
                <View
                    style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                >
                    {/* TODO: Maybe add spinning pokeball loading animation */}
                    <Text style={{ fontFamily: "Silkscreen" }}>Loading...</Text>
                </View>
            )}
            
            {searchResults?.length === 0 ? ( 
                <FlashList
                    style={{ marginBottom: height / 10, height: "100%", width: "100%" }}
                    data={allPokemon}
                    keyExtractor={(item) => String(item?.id || "unknown")}
                    renderItem={({ item, index }) => (
                        <Link
                            href={`/(pokemon)/pokemonDetails/${item.name}`}
                            key={index}
                            asChild
                        >
                            <TouchableOpacity>
                                <LinearGradient
                                    style={{ width: "100%", zIndex: -10 }}
                                    start={{ x: 0.1, y: 0 }}
                                    colors={PokeTypeColor(item.primaryType)}
                                >
                                    <View style={styles.item}>
                                        {PokeTypeIcon(item.primaryType)}
                                        {item.defaultSprite && (
                                            <Image
                                                source={{ uri: item.defaultSprite! }}
                                                style={styles.preview}
                                            />
                                        )}
                                        <Text
                                            style={[
                                                styles.itemText,
                                                { color: readableColor(item.primaryType) },
                                            ]}
                                        >
                                            #{item.id} {item.name}
                                        </Text>
                                        <ForwardChev
                                            width={8}
                                            height={14}
                                            style={{ marginRight: 15 }}
                                        />
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        </Link>
                    )}
                />
            ) : (
                <FlashList
                    style={{ marginBottom: height / 10, height: "100%", width: "100%" }}
                        data={searchResults}
                    keyExtractor={(item) => String(item?.id || "unknown")}
                    renderItem={({ item, index }) => (
                        <Link
                            href={`/(pokemon)/pokemonDetails/${item.name}`}
                            key={index}
                            asChild
                        >
                            <TouchableOpacity>
                                <LinearGradient
                                    style={{ width: "100%", zIndex: -10 }}
                                    start={{ x: 0.1, y: 0 }}
                                    colors={PokeTypeColor(item.primaryType)}
                                >
                                    <View style={styles.item}>
                                        {PokeTypeIcon(item.primaryType)}
                                        {item.defaultSprite && (
                                            <Image
                                                source={{ uri: item.defaultSprite! }}
                                                style={styles.preview}
                                            />
                                        )}
                                        <Text
                                            style={[
                                                styles.itemText,
                                                { color: readableColor(item.primaryType) },
                                            ]}
                                        >
                                            #{item.id} {item.name}
                                        </Text>
                                        <ForwardChev
                                            width={8}
                                            height={14}
                                            style={{ marginRight: 15 }}
                                        />
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        </Link>
                    )}
                />
            )}
        </View>
    )
}

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
        color: "#000000",
        fontFamily: "Silkscreen",
        textTransform: "capitalize",
        flex: 1,
        zIndex: 10,
    },
})

export default index