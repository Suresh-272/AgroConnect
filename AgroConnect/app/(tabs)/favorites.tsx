import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const favoriteItems = [
  {
    id: 1,
    name: 'Organic Tomatoes',
    price: 4.99,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=300&auto=format&fit=crop',
    farmer: 'Green Valley Farm',
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Fresh Corn',
    price: 2.99,
    unit: 'piece',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=300&auto=format&fit=crop',
    farmer: 'Sunrise Organics',
    rating: 4.6,
  },
  {
    id: 3,
    name: 'Farm Eggs',
    price: 5.99,
    unit: 'dozen',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?q=80&w=300&auto=format&fit=crop',
    farmer: 'Fresh Fields',
    rating: 4.9,
  },
];

export default function Favorites() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
        <Text style={styles.subtitle}>Items you've marked as favorites</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {favoriteItems.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.name}</Text>
                <TouchableOpacity>
                  <Ionicons name="heart" size={24} color="#53B175" />
                </TouchableOpacity>
              </View>
              <Text style={styles.farmerName}>{item.farmer}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>₹{item.price.toFixed(2)}</Text>
                <Text style={styles.unit}>/ {item.unit}</Text>
              </View>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#181725',
  },
  subtitle: {
    fontSize: 16,
    color: '#7C7C7C',
    marginTop: 5,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 120,
    height: 120,
  },
  itemInfo: {
    flex: 1,
    padding: 15,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181725',
  },
  farmerName: {
    fontSize: 14,
    color: '#7C7C7C',
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#181725',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: '#53B175',
  },
  unit: {
    marginLeft: 4,
    fontSize: 14,
    color: '#7C7C7C',
  },
  addButton: {
    backgroundColor: '#53B175',
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});