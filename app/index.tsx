import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, ScrollView, Image, ImageBackground } from 'react-native'
import React from 'react'
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen'

SplashScreen.preventAutoHideAsync();

const Home = () => {

  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();


  return (
    <ScrollView style={{ overflow: 'hidden', marginBottom: insets.bottom }}>
        <Link href={`(pokemon)/all`} asChild>
        </Link>
        <View style={styles.genGrid}>
          <Link href={`(pokemon)/generations/${2}`} asChild>
            <TouchableOpacity>
              <View style={[styles.genGridItem, { width: width / 2.1 }]}>
                <ImageBackground
                  source={require("../assets/GenBGs/Gen1-bg.png")}
                  style={styles.backgroundImageSize}
                  resizeMode='cover'
                >
                  <View style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: 'center', alignItems: 'center', marginTop: "30%" }}>
                    <Image source={require("../assets/AllPokemon/Squirtle.png")} style={{ height: 39, width: 39 }} />
                    <Image source={require("../assets/AllPokemon/Bulbasaur.png")} style={{ height: 39, width: 39, marginTop: "16%" }} />
                    <Image source={require("../assets/AllPokemon/Charmander.png")} style={{ height: 39, width: 39 }} />
                  </View>
                  <Text style={styles.genText}>Gen 1</Text>
                </ImageBackground>
              </View>
            </TouchableOpacity>
          </Link>
          <Link href={`(pokemon)/generations/${3}`} asChild>
            <TouchableOpacity>
              <View style={[styles.genGridItem, { width: width / 2.1 }]}>
                <ImageBackground source={require("../assets/GenBGs/Gen2-bg.png")}
                  style={styles.backgroundImageSize}
                  resizeMode='cover'>
                  <View style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: 'center', alignItems: 'center', marginTop: "30%" }}>
                    <Image source={require("../assets/AllPokemon/Cyndaquil.png")} style={{ height: 37, width: 42, transform: [{ translateX: 10 }] }} />
                    <Image source={require("../assets/AllPokemon/Totodile.png")} style={{ height: 36, width: 37, marginTop: "18%" }} />
                    <Image source={require("../assets/AllPokemon/Chikorita.png")} style={{ height: 44, width: 39, transform: [{ translateX: -10 }] }} />
                  </View>
                  <Text style={styles.genText}>Gen 2</Text>
                </ImageBackground>

              </View>
            </TouchableOpacity>
          </Link>
          <Link href={`(pokemon)/generations/${4}`} asChild>
            <TouchableOpacity>
              <View style={[styles.genGridItem, { width: width / 2.1 }]}>
                <ImageBackground source={require("../assets/GenBGs/Gen3-bg.png")}
                  style={styles.backgroundImageSize}
                  resizeMode='cover'>
                  <View style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: 'center', alignItems: 'center', marginTop: "30%" }}>
                    <Image source={require("../assets/AllPokemon/Treeko.png")} style={{ height: 45, width: 38 }} />
                    <Image source={require("../assets/AllPokemon/Mudkip.png")} style={{ height: 42, width: 39, marginTop: "16%" }} />
                    <Image source={require("../assets/AllPokemon/Torchic.png")} style={{ height: 44, width: 25 }} />
                  </View>
                  <Text style={styles.genText}>Gen 3</Text>
                </ImageBackground>
              </View>
            </TouchableOpacity>
          </Link>
          <Link href={`(pokemon)/generations/${5}`} asChild>
            <TouchableOpacity>
              <View style={[styles.genGridItem, { width: width / 2.1 }]}>
                <ImageBackground source={require("../assets/GenBGs/Gen4-bg.png")}
                  style={styles.backgroundImageSize}
                  resizeMode='cover'>
                  <View style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: 'center', alignItems: 'center', marginTop: "30%" }}>
                    <Image source={require("../assets/AllPokemon/Turtwig.png")} style={{ height: 42, width: 31 }} />
                    <Image source={require("../assets/AllPokemon/Chimchar.png")} style={{ height: 44, width: 30, marginTop: "15%" }} />
                    <Image source={require("../assets/AllPokemon/Piplup.png")} style={{ height: 35, width: 27, marginTop: 7 }} />
                  </View>
                  <Text style={styles.genText}>Gen 4</Text>
                </ImageBackground>
              </View>
            </TouchableOpacity>
          </Link>
          <Link href={`(pokemon)/generations/${6}`} asChild>
            <TouchableOpacity>
              <View style={[styles.genGridItem, { width: width / 2.1 }]}>
                <ImageBackground source={require("../assets/GenBGs/Gen5-bg.png")}
                  style={styles.backgroundImageSize}
                  resizeMode='cover'>
                  <View style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: 'center', alignItems: 'center', marginTop: "34%" }}>
                    <Image source={require("../assets/AllPokemon/Snivy.png")} style={{ height: 37, width: 40, marginTop: 2 }} />
                    <Image source={require("../assets/AllPokemon/Oshawott.png")} style={{ height: 36, width: 29, marginTop: "15%" }} />
                    <Image source={require("../assets/AllPokemon/Tepig.png")} style={{ height: 39, width: 33 }} />
                  </View>
                  <Text style={styles.genText}>Gen 5</Text>
                </ImageBackground>
              </View>
            </TouchableOpacity>
          </Link>
          <Link href={`(pokemon)/generations/${7}`} asChild>
            <TouchableOpacity>
              <View style={[styles.genGridItem, { width: width / 2.1 }]}>
                <ImageBackground source={require("../assets/GenBGs/Gen6-bg.png")}
                  style={styles.backgroundImageSize}
                  resizeMode='cover'>
                  <View style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: 'center', alignItems: 'center', marginTop: "35%" }}>
                    <Image source={require("../assets/AllPokemon/Chespin.png")} style={{ height: 47, width: 34 }} />
                    <Image source={require("../assets/AllPokemon/Froakie.png")} style={{ height: 35, width: 32, marginTop: "15%" }} />
                    <Image source={require("../assets/AllPokemon/Fenekin.png")} style={{ height: 43, width: 38, marginTop: 7 }} />
                  </View>
                  <Text style={styles.genText}>Gen 6</Text>
                </ImageBackground>
              </View>
            </TouchableOpacity>
          </Link>
          <Link href={`(pokemon)/generations/${8}`} asChild>
            <TouchableOpacity>
              <View style={[styles.genGridItem, { width: width / 2.1 }]}>
                <ImageBackground source={require("../assets/GenBGs/Gen7-bg.png")}
                  style={styles.backgroundImageSize}
                  resizeMode='cover'>
                  <View style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: 'center', alignItems: 'center', marginTop: "30%" }}>
                    <Image source={require("../assets/AllPokemon/Rowlett.png")} style={{ height: 35, width: 30, marginTop: 8 }} />
                    <Image source={require("../assets/AllPokemon/Litten.png")} style={{ height: 40, width: 47, marginTop: "15%" }} />
                    <Image source={require("../assets/AllPokemon/Popplio.png")} style={{ height: 39, width: 40, marginTop: 7 }} />
                  </View>
                  <Text style={styles.genText}>Gen 7</Text>
                </ImageBackground>
              </View>
            </TouchableOpacity>
          </Link>
          <Link href={`(pokemon)/generations/${9}`} asChild>
            <TouchableOpacity>
              <View style={[styles.genGridItem, { width: width / 2.1 }]}>
                <ImageBackground source={require("../assets/GenBGs/Gen8-bg.png")}
                  style={styles.backgroundImageSize}
                  resizeMode='cover'>
                  <View style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: 'center', alignItems: 'center', marginTop: "30%" }}>
                    <Image source={require("../assets/AllPokemon/Grookey.png")} style={{ height: 42, width: 36, marginTop: 3 }} />
                    <Image source={require("../assets/AllPokemon/Scorbunny.png")} style={{ height: 51, width: 33, marginTop: "10%" }} />
                    <Image source={require("../assets/AllPokemon/Sobble.png")} style={{ height: 46, width: 36 }} />
                  </View>
                  <Text style={styles.genText}>Gen 8</Text>
                </ImageBackground>
              </View>
            </TouchableOpacity>
          </Link>
          <Link href={`(pokemon)/generations/${10}`} asChild>
            <TouchableOpacity>
              <View style={[styles.genGridItem, { width: width / 2.1 }]}>
                <ImageBackground source={require("../assets/GenBGs/Gen9-bg.png")}
                  style={styles.backgroundImageSize}
                  resizeMode='cover'>
                  <View style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: 'center', alignItems: 'center', marginTop: "30%" }}>
                    <Image source={require("../assets/AllPokemon/Sprigatito.png")} style={{ height: 43, width: 38, marginTop: 5 }} />
                    <Image source={require("../assets/AllPokemon/Quaxly.png")} style={{ height: 50, width: 32, marginTop: "12%" }} />
                    <Image source={require("../assets/AllPokemon/Fuecoco.png")} style={{ height: 49, width: 40 }} />
                  </View>
                  <Text style={styles.genText}>Gen 9</Text>
                </ImageBackground>
              </View>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
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
    width: "100%",
    fontSize: 18
  },

  genText: {
    position: 'absolute',
    bottom: 0,
    left: "33%",
    color: "white",
    fontFamily: "Silkscreen",
    width: "100%",
    fontSize: 16
  }
})

export default Home