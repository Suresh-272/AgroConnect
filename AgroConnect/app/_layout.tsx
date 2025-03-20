import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(splash)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(farmers)" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}