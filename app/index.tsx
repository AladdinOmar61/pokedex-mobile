import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, ScrollView, Image, ImageBackground } from 'react-native'
import React from 'react'
import { Link } from 'expo-router';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const Home = () => {

  const { width, height } = useWindowDimensions();
  // const tabHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();

  return (
    <View>
      <ScrollView style={{ marginBottom: insets.bottom }}>
        <Link href="/(pokemon)/all" asChild>
          <TouchableOpacity>
            <View style={[styles.genGridItem, { overflow: 'visible', alignItems: 'center' }]}>
              <ImageBackground
                source={require("../assets/All-Gens-bg.png")}
                style={styles.backgroundImageSize}
                resizeMode='cover'
              >
                <View style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                  <Image source={require("../assets/AllPokemon/Dragapult.png")} style={{ marginHorizontal: -5 }} />
                  <Image source={require("../assets/AllPokemon/Talonflame.png")} style={{ marginHorizontal: -30, zIndex: 1, marginTop: 5 }} />
                  <Image source={require("../assets/AllPokemon/Lucario.png")} style={{ marginHorizontal: -30, zIndex: 2, marginTop: 20 }} />
                  <Image source={require("../assets/AllPokemon/Tyranitar.png")} style={{ marginHorizontal: -10, zIndex: 3, marginTop: 30 }} />
                  <Image source={require("../assets/AllPokemon/Pikachu.png")} style={{ marginHorizontal: -40, zIndex: 4, marginTop: 50 }} />
                  <Image source={require("../assets/AllPokemon/Gardevior.png")} style={{ marginHorizontal: -20, zIndex: 3, marginTop: 30 }} />
                  <Image source={require("../assets/AllPokemon/Zoroark.png")} style={{ marginHorizontal: -20, zIndex: 2, marginTop: 20 }} />
                  <Image source={require("../assets/AllPokemon/Mimikyu.png")} style={{ marginHorizontal: -30, zIndex: 1, marginTop: 20 }} />
                  <Image source={require("../assets/AllPokemon/Ceruledge.png")} style={{ marginHorizontal: -10 }} />
                </View>
                <Text style={styles.allGensText}>ALL</Text>
              </ImageBackground>
            </View>
          </TouchableOpacity>
        </Link>
        <View style={styles.genGrid}>
          <Link href={`(pokemon)/generations/${1}`} asChild>
            <TouchableOpacity>
              <View style={[styles.genGridItem, { width: width / 2.1 }]}>
                <ImageBackground
                  source={require("../assets/Gen1-bg.png")}
                  style={styles.backgroundImageSize}
                  resizeMode='cover'
                >
                  <View style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: 'center', alignItems: 'center', marginTop: "30%" }}>
                    <Image source={require("../assets/Squirtle.png")} style={{ height: 39, width: 39 }} />
                    <Image source={require("../assets/Bulbasaur.png")} style={{ height: 39, width: 39, marginTop: "16%" }} />
                    <Image source={require("../assets/Charmander.png")} style={{ height: 39, width: 39 }} />
                  </View>
                  <Text style={styles.genText}>Gen 1</Text>
                </ImageBackground>
              </View>
            </TouchableOpacity>
          </Link>
          <Link href={`(pokemon)/generations/${2}`} asChild>
            <TouchableOpacity>
              <View style={[styles.genGridItem, { width: width / 2.1 }]}><Text>Gen 2</Text></View>
            </TouchableOpacity>
          </Link>
          <Link href={`(pokemon)/generations/${3}`} asChild>
            <TouchableOpacity>
              <View style={[styles.genGridItem, { width: width / 2.1 }]}><Text>Gen 3</Text></View>
            </TouchableOpacity>
          </Link>
          <Link href={`(pokemon)/generations/${4}`} asChild>
            <TouchableOpacity>
              <View style={[styles.genGridItem, { width: width / 2.1 }]}><Text>Gen 4</Text></View>
            </TouchableOpacity>
          </Link>
          <Link href={`(pokemon)/generations/${5}`} asChild>
            <TouchableOpacity>
              <View style={[styles.genGridItem, { width: width / 2.1 }]}><Text>Gen 5</Text></View>
            </TouchableOpacity>
          </Link>
          <Link href={`(pokemon)/generations/${6}`} asChild>
            <TouchableOpacity>
              <View style={[styles.genGridItem, { width: width / 2.1 }]}><Text>Gen 6</Text></View>
            </TouchableOpacity>
          </Link>
          <Link href={`(pokemon)/generations/${7}`} asChild>
            <TouchableOpacity>
              <View style={[styles.genGridItem, { width: width / 2.1 }]}><Text>Gen 7</Text></View>
            </TouchableOpacity>
          </Link>
          <Link href={`(pokemon)/generations/${8}`} asChild>
            <TouchableOpacity>
              <View style={[styles.genGridItem, { width: width / 2.1 }]}><Text>Gen 8</Text></View>
            </TouchableOpacity>
          </Link>
          <Link href={`(pokemon)/generations/${9}`} asChild>
            <TouchableOpacity>
              <View style={[styles.genGridItem, { width: width / 2.1 }]}><Text>Gen 9</Text></View>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  genGrid: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  genGridItem: {
    height: 150,
    margin: 4,
    borderBottomWidth: 1,
    borderTopWidth: 1
  },

  backgroundImageSize: {
    flex: 1,
    width: "100%",
    height: "100%"
  },

  allGensText: {
    position: 'absolute',
    bottom: 0,
    left: "45%",
    color: "white",
    fontFamily: "Silkscreen",
    fontSize: 18
  },

  genText: {
    position: 'absolute',
    bottom: 0,
    left: "38%",
    color: "white",
    fontFamily: "Silkscreen",
    fontSize: 18
  }
})

export default Home