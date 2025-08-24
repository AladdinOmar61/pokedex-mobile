import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const Home = () => {
  return (
      <View>
          <Link href="/(pokemon)/test">
              <Text>Open test page</Text>
          </Link>
    </View>
  )
}

export default Home