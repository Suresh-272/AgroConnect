import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function FarmerDashboard() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    unit: '',
    description: '',
    category: '',
    image: ''
  });

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://192.168.43.112:3500/user/add', formData);
      Alert.alert('Success', 'Product added successfully');
      setFormData({
        name: '',
        price: '',
        unit: '',
        description: '',
        category: '',
        image: ''
      });
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to add product');
    }
  };

  const handleLogout = () => {
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add New Product</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Product Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter product name"
              value={formData.name}
              onChangeText={(text) => setFormData({...formData, name: text})}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter price"
              value={formData.price}
              onChangeText={(text) => setFormData({...formData, price: text})}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Unit (kg, liter, piece)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter unit"
              value={formData.unit}
              onChangeText={(text) => setFormData({...formData, unit: text})}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter product description"
              value={formData.description}
              onChangeText={(text) => setFormData({...formData, description: text})}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Category</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter category"
              value={formData.category}
              onChangeText={(text) => setFormData({...formData, category: text})}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Image URL</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter image URL"
              value={formData.image}
              onChangeText={(text) => setFormData({...formData, image: text})}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Add Product</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#53B175'
  },
  logoutButton: {
    backgroundColor: '#FF4B4B',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  form: {
    gap: 15
  },
  inputContainer: {
    gap: 5
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4C4C4C'
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 8,
    padding: 12,
    fontSize: 16
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  button: {
    backgroundColor: '#53B175',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  }
});
