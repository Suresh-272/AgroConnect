import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';

const menuItems = [
  { id: 1, title: 'Orders', icon: 'receipt-outline' as const },
  { id: 2, title: 'My Details', icon: 'person-outline' as const },
  { id: 3, title: 'Delivery Address', icon: 'location-outline' as const },
  { id: 4, title: 'Payment Methods', icon: 'card-outline' as const },
  { id: 5, title: 'Notifications', icon: 'notifications-outline' as const },
  { id: 6, title: 'Help', icon: 'help-circle-outline' as const },
  { id: 7, title: 'About', icon: 'information-circle-outline' as const },
];

export default function Account() {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    totalOrders: 0,
    pendingOrders: 0,
    rating: 0
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [addressForm, setAddressForm] = useState({
    type: '',
    address: '',
    latitude: '',
    longitude: '',
    landmark: ''
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.post('http://192.168.43.112:3500/user/acc', {
          userId: "67c47725b322f61f7b759d9e" // Replace with actual user ID from auth
        });
        
        setUserDetails({
          name: response.data.name,
          email: response.data.email,
          totalOrders: response.data.totalOrders,
          pendingOrders: response.data.pendingOrders,
          rating: response.data.rating
        });
      } catch (error) {
        console.error('Error fetching user details:', error);
        Alert.alert('Error', 'Failed to load user details');
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    router.replace('/login');
  };

  const handleAddAddress = async () => {
    try {
      // Validate form fields
      if (!addressForm.type || !addressForm.address || !addressForm.latitude || !addressForm.longitude) {
        Alert.alert('Error', 'Please fill all required fields');
        return;
      }

      const response = await axios.post('http://192.168.43.112:3500/user/address', {
        userId: "67c47725b322f61f7b759d9e",
        type: addressForm.type,
        address: addressForm.address,
        latitude: parseFloat(addressForm.latitude),
        longitude: parseFloat(addressForm.longitude),
        landmark: addressForm.landmark
      });

      Alert.alert('Success', 'Address added successfully');
      setModalVisible(false);
      setAddressForm({ type: '', address: '', latitude: '', longitude: '', landmark: '' });
    } catch (error) {
      console.error('Error adding address:', error);
      Alert.alert('Error', 'Failed to add address');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <Image
             source={require('../../assets/images/carrot-icon.png')}
              style={styles.profileImage}
            />
            <View style={styles.profileText}>
              <Text style={styles.name}>{userDetails.name}</Text>
              <Text style={styles.email}>{userDetails.email}</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={20} color="#53B175" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userDetails.totalOrders}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userDetails.pendingOrders}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userDetails.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.menuItem}
              onPress={() => {
                if(item.title === 'Delivery Address') {
                  setModalVisible(true);
                }
              }}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon} size={24} color="#181725" />
                <Text style={styles.menuItemTitle}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#7C7C7C" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FF4B4B" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Address</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Type (e.g., Home, Work)"
                value={addressForm.type}
                onChangeText={(text) => setAddressForm({...addressForm, type: text})}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Address"
                value={addressForm.address}
                onChangeText={(text) => setAddressForm({...addressForm, address: text})}
                multiline
              />
              
              <TextInput
                style={styles.input}
                placeholder="Latitude"
                value={addressForm.latitude}
                onChangeText={(text) => setAddressForm({...addressForm, latitude: text})}
                keyboardType="numeric"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Longitude"
                value={addressForm.longitude}
                onChangeText={(text) => setAddressForm({...addressForm, longitude: text})}
                keyboardType="numeric"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Landmark (Optional)"
                value={addressForm.landmark}
                onChangeText={(text) => setAddressForm({...addressForm, landmark: text})}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.submitButton]}
                  onPress={handleAddAddress}
                >
                  <Text style={[styles.buttonText, styles.submitText]}>Add Address</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  },
  header: {
    padding: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 40,
    overflow: 'hidden',
    resizeMode: 'cover',
  },
  profileText: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#181725',
  },
  email: {
    fontSize: 14,
    color: '#7C7C7C',
    marginTop: 4,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F3F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#181725',
  },
  statLabel: {
    fontSize: 14,
    color: '#7C7C7C',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#F2F3F2',
  },
  menuContainer: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F3F2',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontSize: 16,
    color: '#181725',
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 40,
    padding: 15,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF4B4B',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#181725',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#F2F3F2',
  },
  submitButton: {
    backgroundColor: '#53B175',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#181725',
  },
  submitText: {
    color: 'white',
  },
});