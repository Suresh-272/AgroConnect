import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';

export default function Login() {
  const [mobileno, setMobileno] = useState('+91');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!mobileno || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('http://172.20.10.5:3500/auth/login', {
        mobileno,
        password,
      });

      const { accessToken, user } = response.data;
      
      // Store token and user data
      // TODO: Add proper token storage using secure storage
      
      Alert.alert('Success', 'Logged in successfully');

      // Route based on userType
      if (user.userType === 'farmer') {
        router.replace('/(farmers)'); // Route to farmer screens
      } else {
        router.replace('/(tabs)'); // Route to buyer screens
      }

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        Alert.alert('Error', error.response.data.message);
      } else {
        console.error('Error logging in:', error);
        Alert.alert('Error', 'Failed to login. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/agrologo.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Welcome to AgroConnect</Text>
        <Text style={styles.subtitle}>
          Connect directly with local farmers and markets
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your mobile number"
            value={mobileno}
            onChangeText={setMobileno}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Link href="/register" asChild>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFC',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#181725',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7C7C7C',
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#181725',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F2F3F2',
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    color: '#181725',
  },
  button: {
    backgroundColor: '#53B175',
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#7C7C7C',
    fontSize: 16,
  },
  footerLink: {
    color: '#53B175',
    fontSize: 16,
    fontWeight: '600',
  },
});