// app/(splash)/index.tsx
import { useEffect } from 'react';
import { View, Image, StyleSheet, Animated, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const router = useRouter();
  const logoOpacity = new Animated.Value(0);

  useEffect(() => {
    // Fade in animation
    Animated.sequence([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      // Hold for a moment
      Animated.delay(1500),
    ]).start(() => {
      // Navigate to login screen after animation
      router.replace('/(auth)/login');
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: logoOpacity, alignItems: 'center' }}>
        <Image
          source={require('../../assets/images/agrologo.png')}
          style={styles.logo}
        />
        <Text style={styles.text}>AgroConnect</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#53B175',
    marginTop: 20,
  },
});