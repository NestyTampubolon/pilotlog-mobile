import React from 'react';
import { Stack } from 'expo-router';
import { JwtAuthProvider } from './Api/jwtAuth';

export default function Layout() {
  return (
    <JwtAuthProvider >
      <Stack>
        <Stack.Screen name='login' options={{ headerShown: false }} />
        <Stack.Screen name='index' options={{ headerShown: false }} />
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen name='(tabsinstructor)' options={{ headerShown: false }} />
        <Stack.Screen name='(tabscpts)' options={{ headerShown: false }} />
        <Stack.Screen name='trainee' options={{ headerShown: false }} />
      </Stack>
    </JwtAuthProvider>
  );
}
