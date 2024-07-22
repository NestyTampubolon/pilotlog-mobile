import { View, Text, Image  } from 'react-native'
import React from 'react'
import MySVG from '../assets/images/emptylist.png';
import COLORS from './colors';
export default function emptylist() {
  return (
    <View style={{ alignItems: 'center' }}>
      <Image source={MySVG} />
        <Text style={{fontWeight: 'bold', fontSize: 16}}>Empty</Text>
      <Text style={{ fontSize: 12, color: COLORS.grey }}>You have no list</Text>
      </View>
  )
}