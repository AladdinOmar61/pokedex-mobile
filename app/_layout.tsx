import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter, Stack } from 'expo-router'
import BackArrow from "@/assets/Icons/Arrow-Left.svg";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const Layout = () => {

    const queryClient = new QueryClient();

    const router = useRouter();

    const pixelBackArrow = () => (
        <TouchableOpacity onPress={() => { router.back() }}>
            <BackArrow width={24} height={24} />
        </TouchableOpacity>
    )

    return (
        <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{
            headerStyle: {
                backgroundColor: "#F4511E"
            },
            headerTintColor: "#FFF"
        }}>
            <Stack.Screen name='index' options={{ title: "Select Generation", headerTitleAlign: 'center', headerTitleStyle: { fontFamily: "Silkscreen", fontSize: 16 } }} />
            <Stack.Screen name='(pokemon)/pokemonDetails/[pokemon]' options={{
                title: "", headerLeft: pixelBackArrow
            }} />
            <Stack.Screen name="(pokemon)/all" options={{
                title: "All Pokemon", headerTitleAlign: 'center', headerTitleStyle: { fontFamily: "Silkscreen", fontSize: 16 }, headerLeft: pixelBackArrow
            }} />
            <Stack.Screen name="(pokemon)/generations/[gen]" options={{
                title: "", headerLeft: pixelBackArrow
            }} />
        </Stack>
        </QueryClientProvider>
    )
}

export default Layout