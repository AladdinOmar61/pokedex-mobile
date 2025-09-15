import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, ScrollView } from 'react-native'
import React from 'react'
import { Link } from 'expo-router';

const Home = () => {

  const { width, height } = useWindowDimensions();

  return (
    <View>
      <ScrollView>
        <Link href="/(pokemon)/all" asChild>
          <TouchableOpacity>
            <View style={[styles.genGridItem, { width: width - 6 }]}>
              <Text>All</Text>
            </View>
          </TouchableOpacity>
        </Link>
        <View style={styles.genGrid}>
          <Link href={`(pokemon)/generations/${1}`} asChild>
            <TouchableOpacity>
              <View style={[styles.genGridItem, { width: width / 2.1 }]}><Text>Gen 1</Text></View>
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
    borderWidth: 1,
    borderColor: 'black',
    margin: 3
  }
})

export default Home