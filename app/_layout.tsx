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
            <Stack.Screen name='index' options={{ title: "Select Generation", headerTitleStyle: {fontFamily: "Silkscreen", fontSize: 16} }} />
            <Stack.Screen name='(pokemon)/pokemonDetails/[pokemon]' options={{ title: "" }} />
            <Stack.Screen name="(pokemon)/all" options={{ title: "All Pokemon", headerTitleStyle: { fontFamily: "Silkscreen", fontSize: 16 } }} />
            <Stack.Screen name="(pokemon)/generations/[gen]" options={{ title: "" }} />
        </Stack>
    )
}

export default Layout