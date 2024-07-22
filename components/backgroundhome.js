import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import Svg, { Ellipse, Circle } from 'react-native-svg';
const windowWidth = Dimensions.get('window').width;
export default function backgroundhome() {
    return (
        <View style={styles.box}>
            <Svg width="340" height="329" viewBox="0 0 379 329" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Circle cx="129" cy="79" r="250" fill="#0064E9" />
            </Svg>
        </View>
    )
}



const styles = StyleSheet.create({
    box: {
        position: 'absolute'
    }
})
