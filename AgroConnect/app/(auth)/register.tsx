import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobileno, setMobileno] = useState('+91');
  const [userType, setUserType] = useState<'farmer' | 'buyer'>('buyer');
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password || !mobileno || !userType) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('http://172.20.10.5:3500/auth/register', {
        name,
        email,
        password,
        mobileno,
        userType,
      });

      Alert.alert('Success', response.data.message);
      router.replace('/(tabs)');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ERR_NETWORK') {
          Alert.alert(
            'Network Error',
            'Unable to connect to server. Please check your internet connection and try again.'
          );
        } else if (error.response) {
          Alert.alert('Error', error.response.data.message);
        } else {
          Alert.alert('Error', 'An unexpected error occurred. Please try again.');
        }
      } else {
        console.error('Error registering:', error);
        Alert.alert('Error', 'Failed to register. Please try again.');
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join the agricultural marketplace</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

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
          <Text style={styles.label}>I am a:</Text>
          <View style={styles.userTypeContainer}>
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === 'farmer' && styles.userTypeButtonActive,
              ]}
              onPress={() => setUserType('farmer')}>
              <Text
                style={[
                  styles.userTypeText,
                  userType === 'farmer' && styles.userTypeTextActive,
                ]}>
                Farmer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === 'buyer' && styles.userTypeButtonActive,
              ]}
              onPress={() => setUserType('buyer')}>
              <Text
                style={[
                  styles.userTypeText,
                  userType === 'buyer' && styles.userTypeTextActive,
                ]}>
                Buyer
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/login" asChild>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Log In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFC',
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
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
  userTypeContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  userTypeButton: {
    flex: 1,
    backgroundColor: '#F2F3F2',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
  },
  userTypeButtonActive: {
    backgroundColor: '#53B175',
  },
  userTypeText: {
    fontSize: 16,
    color: '#181725',
    fontWeight: '500',
  },
  userTypeTextActive: {
    color: '#FFF',
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
    marginBottom: 30,
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