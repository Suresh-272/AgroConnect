import { Stack } from 'expo-router';

export default function FarmerLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen 
        name="index"
        options={{
          title: "Farmer Dashboard"
        }}
      />
    </Stack>
  );
}
