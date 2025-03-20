import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const categories = [
  { id: 1, name: 'Vegetables', icon: 'leaf-outline' },
  { id: 2, name: 'Fruits', icon: 'nutrition-outline' },
  { id: 3, name: 'Grains', icon: 'basket-outline' },
  { id: 4, name: 'Dairy', icon: 'water-outline' },
  { id: 5, name: 'Meat', icon: 'restaurant-outline' },
  { id: 6, name: 'Poultry', icon: 'egg-outline' },
];

const farmers = [
  {
    id: 1,
    name: 'Green Valley Farm',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=300&auto=format&fit=crop',
    rating: 4.8,
    distance: '2.5 km',
  },
  {
    id: 2,
    name: 'Sunrise Organics',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=300&auto=format&fit=crop',
    rating: 4.6,
    distance: '3.8 km',
  },
  {
    id: 3,
    name: 'Fresh Fields',
    image: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?q=80&w=300&auto=format&fit=crop',
    rating: 4.9,
    distance: '1.2 km',
  },
];

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Explore</Text>
          <Text style={styles.subtitle}>Find farmers and products near you</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#181725" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search farmers, products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoriesContainer}>
              {categories.map((category) => (
                <TouchableOpacity key={category.id} style={styles.categoryCard}>
                  <Ionicons name={category.icon} size={24} color="#53B175" />
                  <Text style={styles.categoryName}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Farmers Near You</Text>
          {farmers.map((farmer) => (
            <TouchableOpacity key={farmer.id} style={styles.farmerCard}>
              <Image source={{ uri: farmer.image }} style={styles.farmerImage} />
              <View style={styles.farmerInfo}>
                <Text style={styles.farmerName}>{farmer.name}</Text>
                <View style={styles.farmerDetails}>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>{farmer.rating}</Text>
                  </View>
                  <View style={styles.distanceContainer}>
                    <Ionicons name="location-outline" size={16} color="#7C7C7C" />
                    <Text style={styles.distanceText}>{farmer.distance}</Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#7C7C7C" />
            </TouchableOpacity>
          ))}
        </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F3F2',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#181725',
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#181725',
    marginLeft: 20,
    marginBottom: 15,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  categoryCard: {
    backgroundColor: '#F2F3F2',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    width: 100,
  },
  categoryName: {
    marginTop: 8,
    fontSize: 14,
    color: '#181725',
    textAlign: 'center',
  },
  farmerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 15,
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
  farmerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  farmerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  farmerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181725',
    marginBottom: 5,
  },
  farmerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  ratingText: {
    marginLeft: 5,
    color: '#181725',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    marginLeft: 5,
    color: '#7C7C7C',
  },
});