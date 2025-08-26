import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const Layout = () => {
    return (
        <Stack screenOptions={{
            headerStyle: {
                backgroundColor: "#F4511E"
            },
            headerTintColor: "#FFF"
        }}>
            <Stack.Screen name='index' options={{ title: "Pokedex Home" }} />
            <Stack.Screen name='(pokemon)/[id]' options={{ title: "" }} />
        </Stack>
    )
}

export default Layout