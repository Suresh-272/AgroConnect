import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  image: string;
  unit: string;
  price: number;
  category: string;
}

interface PredictionResponse {
  current_price: number;
}

const categories = [
  { id: 1, name: 'Fresh Produce', image: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?q=80&w=300&auto=format&fit=crop' },
  { id: 2, name: 'Grains', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=300&auto=format&fit=crop' },
  { id: 3, name: 'Dairy', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=300&auto=format&fit=crop' },
  { id: 4, name: 'Livestock', image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=300&auto=format&fit=crop' },
];

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceMap, setPriceMap] = useState<Record<string, number>>({});

  const fetchPredictedPrice = async (commodityName: string) => {
    try {
      const response = await axios.get<PredictionResponse>(`http://192.168.0.102:5000/api/commodity/${commodityName.toLowerCase()}`);
      return response.data.current_price;
    } catch (error) {
      console.error(`Error fetching prediction for ${commodityName}:`, error);
      return null;
    }
  };

  useEffect(() => {
    const getProductsWithPredictions = async () => {
      try {
        const response = await axios.get('http://192.168.0.102:3500/user/getprods');
        const fetchedProducts = response.data;

        const newPriceMap: Record<string, number> = {};
        for (const product of fetchedProducts) {
          const predictedPrice = await fetchPredictedPrice(product.name);
          if (predictedPrice !== null) {
            newPriceMap[product._id] = predictedPrice;
          }
        }

        setPriceMap(newPriceMap);
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    getProductsWithPredictions();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredProducts(filtered);
  }, [searchQuery, products, selectedCategory]);

  const handleAddToCart = async (productId: string) => {
    try {
      await axios.post('http://192.168.0.102:3500/user/addtocart', {
        userId: "67c47725b322f61f7b759d9e",
        productId,
        quantity: 1
      });
      Alert.alert('Success', 'Product added to cart!');
    } catch (error) {
      console.error("Error adding to cart:", error);
      Alert.alert('Error', 'Failed to add product to cart');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={require('../../assets/images/agrologo.png')} style={styles.logo} />
          <Text style={styles.location}>Egmore, Chennai</Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#181725" style={styles.searchIcon} />
          <TextInput
            placeholder="Search fresh produce, grains..."
            style={styles.searchInput}
            placeholderTextColor="#7C7C7C"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            <TouchableOpacity
              style={[styles.categoryCard, selectedCategory === 'All' && styles.selectedCategory]}
              onPress={() => setSelectedCategory('All')}
            >
              <Image source={{ uri: 'https://cdn.pixabay.com/photo/2024/05/19/18/22/fruit-8773085_1280.jpg' }} style={styles.categoryImage} />
              <Text style={styles.categoryName}>All</Text>
            </TouchableOpacity>
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryCard, selectedCategory === category.name && styles.selectedCategory]}
                onPress={() => setSelectedCategory(category.name)}
              >
                <Image source={{ uri: category.image }} style={styles.categoryImage} />
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'All' ? 'All Products' : selectedCategory}
          </Text>
          {loading ? (
            <ActivityIndicator size="large" color="#53B175" />
          ) : (
            <View style={styles.productsGrid}>
              {filteredProducts.map(product => (
                <TouchableOpacity key={product._id} style={styles.productCard}>
                  <Image source={{ uri: product.image }} style={styles.productImage} />
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productUnit}>{product.unit}</Text>
                  <View style={styles.productBottom}>
                    <Text style={styles.productPrice}>
                      ₹{priceMap[product._id]?.toFixed(2) || '0.00'}
                    </Text>
                    <TouchableOpacity style={styles.addButton} onPress={() => handleAddToCart(product._id)}>
                      <Ionicons name="add" size={20} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCFCFC' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20 },
  logo: { width: 80, height: 50, borderRadius: 20 },
  location: { marginLeft: 12, fontSize: 18, fontWeight: '600', color: '#181725' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F2F3F2', marginHorizontal: 20, marginTop: 20, paddingHorizontal: 15, borderRadius: 15, height: 50 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#181725' },
  section: { marginTop: 30 },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#181725', marginLeft: 20, marginBottom: 15 },
  categoriesScroll: { paddingLeft: 20 },
  categoryCard: { marginRight: 15, width: 120, height: 150, borderRadius: 15, overflow: 'hidden' },
  selectedCategory: { borderWidth: 2, borderColor: '#53B175' },
  categoryImage: { width: '100%', height: '100%' },
  categoryName: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', color: '#FFF', padding: 8, textAlign: 'center', fontSize: 14, fontWeight: '500' },
  productsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15 },
  productCard: { width: '46%', marginHorizontal: '2%', marginBottom: 20, backgroundColor: '#FFF', borderRadius: 15, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  productImage: { width: '100%', height: 120, borderRadius: 10, marginBottom: 10 },
  productName: { fontSize: 16, fontWeight: '500', color: '#181725' },
  productUnit: { fontSize: 14, color: '#7C7C7C', marginTop: 4 },
  productBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  productPrice: { fontSize: 18, fontWeight: '600', color: '#181725' },
  addButton: { backgroundColor: '#53B175', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
