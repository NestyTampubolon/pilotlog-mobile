import React from 'react'
import { Tabs } from 'expo-router'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { JwtAuthProvider } from '../Api/jwtAuth';


export default function TabLayout() {
  return (
    <JwtAuthProvider >
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
           headerShown: false ,
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color}  

          />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'history',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'profile',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
        }}
      />
    </Tabs>
      </JwtAuthProvider >
  );
}