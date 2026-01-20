import { Pressable, View } from 'react-native'
import React from 'react'
import SearchIcon from "@/assets/Icons/SearchIcon.svg";
import { Link } from 'expo-router';

const Search = () => {
    return (
        <View>
            <Link href="/searchPokemon" asChild>
                <Pressable>
                    <SearchIcon />
                </Pressable>
            </Link>
        </View>
    )
}

export default Search