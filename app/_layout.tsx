import { TouchableOpacity, StatusBar } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter, Stack, SplashScreen } from "expo-router";
import BackArrow from "@/assets/Icons/Arrow-Left.svg";
import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Search from "@/components/SearchButton";
import { useAtom } from "jotai";
import { searchAtom } from "@/atoms";
import SearchField from "@/components/SearchField";

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: Infinity,
      staleTime: 1000 * 60 * 60 * 24,
    },
  },
});

const Layout = () => {
  useReactQueryDevTools(queryClient);

  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [searchText, setSearchText] = useAtom(searchAtom);

  const [loaded, error] = useFonts({
    Silkscreen: require("../assets/Fonts/Silkscreen-Regular.ttf"),
  });

  // const toggleFavorite = async () => {
  //   await AsyncStorage.setItem(
  //     `favorite-${pokemon}`,
  //     !isFavorited ? "true" : "false"
  //   );
  //   setIsFavorited(!isFavorited);
  // };

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
    <TouchableOpacity
      onPress={() => {
        router.back();
        setSearchText("");
      }}
    >
      <BackArrow width={24} height={24} />
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister: asyncStoragePersister,
          dehydrateOptions: {
            shouldDehydrateQuery: (query) =>
              defaultShouldDehydrateQuery(query) && query?.meta?.persist === true,
          },
        }}
      >
          <StatusBar backgroundColor={"#F4511E"} />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: "#F4511E",
            },
            headerTintColor: "#FFF",
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: "select generation",
              headerTitleAlign: "center",
              headerTitleStyle: { fontFamily: "Silkscreen", fontSize: 16 },
              headerRight: () => (
                <Search />
              )
            }}
          />
          <Stack.Screen
            name="(pokemon)/pokemonDetails/[pokemon]"
            options={{
              title: "",
              headerLeft: pixelBackArrow,
            }}
          />
          <Stack.Screen
            name="(pokemon)/all"
            options={{
              title: "All Pokemon",
              headerTitleAlign: "center",
              headerTitleStyle: { fontFamily: "Silkscreen", fontSize: 16 },
              headerLeft: pixelBackArrow,
            }}
          />
          <Stack.Screen
            name="(pokemon)/generations/[gen]"
            options={{
              title: "",
              headerLeft: pixelBackArrow,
              headerRight: () => (
                <Search />
              )
            }}
          />
          <Stack.Screen
            name="searchPokemon/index"
            options={{
              title: 'Search',
              headerLeft: pixelBackArrow,
              headerTitle: () => (
                <SearchField/>
              )
            }}
          />
          </Stack>
      </PersistQueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default Layout;
