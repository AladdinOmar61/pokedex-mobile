import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useRouter, Stack, SplashScreen } from 'expo-router'
import BackArrow from "@/assets/Icons/Arrow-Left.svg";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useReactQueryDevTools } from '@dev-plugins/react-query';
import { useFonts } from 'expo-font'

const asyncStoragePersister = createAsyncStoragePersister({
    storage: AsyncStorage,
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 1000 * 60 * 60 * 24, // 24 hours
            staleTime: 1000 * 60 * 5,
        },
    },
})

const Layout = () => {
    useReactQueryDevTools(queryClient);

    const [loaded, error] = useFonts({
        "Silkscreen": require("../assets/Fonts/Silkscreen-Regular.ttf"),
    });
    
    useEffect(() => {
        if (loaded || error) {
          SplashScreen.hideAsync();
        }
      }, [loaded, error]);
    
      if (!loaded && !error) {
        return null;
      }

    const router = useRouter();

    const pixelBackArrow = () => (
        <TouchableOpacity onPress={() => { router.back() }}>
            <BackArrow width={24} height={24} />
        </TouchableOpacity>
    )

    return (
        <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: asyncStoragePersister }}
        >
        <Stack screenOptions={{
            headerStyle: {
                backgroundColor: "#F4511E"
            },
            headerTintColor: "#FFF"
        }}>
            <Stack.Screen name='index' options={{ title: "select generation", headerTitleAlign: 'center', headerTitleStyle: { fontFamily: "Silkscreen", fontSize: 16 } }} />
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
        </PersistQueryClientProvider>
    )
}

export default Layout