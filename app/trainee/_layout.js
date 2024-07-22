import React from 'react'
import { Stack } from 'expo-router'

export default function _layout() {
  return (
   <Stack>
      <Stack.Screen name='scanbarcode' options={{ headerShown: false }} />
      {/* <Stack.Screen name='signatureattendance' options={{ headerShown: false }} /> */}
      {/* <Stack.Screen name='classhistory' options={{ headerShown: false }} /> */}
   </Stack>
 
  )
}