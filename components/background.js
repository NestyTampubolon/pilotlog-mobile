import { View, Text, StyleSheet, Dimensions} from 'react-native'
import React from 'react'
import Svg, { Ellipse } from 'react-native-svg';
const windowWidth = Dimensions.get('window').width;
export default function background() {
  return (
      <View style={styles.box}>
          <Svg width={`${windowWidth}`} height="137" viewBox="0 0 393 137" fill="none" xmlns="http://www.w3.org/2000/svg">
              <Ellipse cx="194" cy="-3.5" rx="250" ry="140.5" fill="#0064E9" />
          </Svg>
      </View>
  )
}

const styles = StyleSheet.create({

    box: {
        position: 'absolute'
    }
})
