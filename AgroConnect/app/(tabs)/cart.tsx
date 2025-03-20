import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { WebView } from 'react-native-webview';

interface CartItem {
  productId: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
}

interface Cart {
  items: CartItem[];
  totalPrice: number;
}

interface PaymentData {
  description: string;
  image: string;
  currency: string;
  key: string;
  amount: number;
  name: string;
  order_id: string;
  prefill: {
    email: string;
    contact: string;
    name: string;
  };
  theme: {
    color: string;
  };
}

interface ErrorWithMessage {
  message?: string;
}

export default function Cart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [showWebView, setShowWebView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = async () => {
    try {
      const response = await axios.post('http://192.168.43.112:3500/user/getcart', {
        userId: "67c47725b322f61f7b759d9e"
      });
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId: string, action: 'increase' | 'decrease') => {
    try {
      const response = await axios.post('http://192.168.43.112:3500/user/addquantity', {
        userId: "67c47725b322f61f7b759d9e",
        productId,
        action
      });
      if (response.data.cart) {
        setCart(response.data.cart);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Error', 'Failed to update quantity');
    }
  };

  const handlePayment = async () => {
    try {
      // Create order
      const orderResponse = await axios.post('http://192.168.43.112:3500/payment/create-order', {
        amount: total,
        currency: 'INR'
      });

      if (!orderResponse.data || !orderResponse.data.order) {
        throw new Error('Invalid order response from server');
      }

      // Prepare payment data
      const options = {
        description: 'Payment for AgroConnect order',
        image: 'https://your-logo-url.com',
        currency: 'INR',
        key: 'rzp_test_ZeUOCsM7PeiJvq',
        amount: total * 100,
        name: 'AgroConnect',
        order_id: orderResponse.data.order.id,
        prefill: {
          email: 'user@example.com',
          contact: '9999999999',
          name: 'User'
        },
        theme: { color: '#53B175' }
      };

      setPaymentData(options);
      setShowWebView(true);

    } catch (error: ErrorWithMessage | any) {
      Alert.alert(
        'Payment Failed',
        error?.message || 'Unable to process payment. Please try again later.'
      );
    }
  };

  const handlePaymentResponse = async (response: any) => {
    try {
      if (response.error) {
        throw new Error(response.error.description);
      }

      setIsLoading(true);

      // Verify payment
      const verificationResponse = await axios.post('http://192.168.43.112:3500/payment/verify-payment', {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature
      });

      if (verificationResponse.data.success) {
        // Create order after successful payment
        const orderData = {
          userId: "67c47725b322f61f7b759d9e",
          storeId: "67c47725b322f61f7b759d9f",
          items: cart?.items.map(item => ({
            productId: item.productId._id,
            quantity: item.quantity
          })),
          amount: total,
          paymentStatus: "Paid"
        };

        // Create order using the order endpoint
        const orderResponse = await axios.post('http://192.168.43.112:3500/user/create', orderData);

        if (orderResponse.data.order) {
          Alert.alert('Success', 'Payment successful and order created!');
          // Clear cart locally
          setCart({
            items: [],
            totalPrice: 0
          });
        } else {
          throw new Error('Failed to create order');
        }
      }
    } catch (error: ErrorWithMessage | any) {
      Alert.alert('Error', error?.message || 'Payment verification failed');
    } finally {
      setShowWebView(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    // Set up interval to fetch cart every 5 seconds
    const interval = setInterval(() => {
      if (cart && cart.items && cart.items.length > 0) {
        fetchCart();
      }
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [cart]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Cart</Text>
        </View>
        <ActivityIndicator size="large" color="#53B175" />
      </SafeAreaView>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Cart</Text>
        </View>
        <View style={styles.emptyCart}>
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
        </View>
      </SafeAreaView>
    );
  }

  const deliveryFee = 2.99;
  const total = (cart?.totalPrice || 0) + deliveryFee;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Cart</Text>
        <Text style={styles.itemCount}>{cart.items.length} items</Text>
      </View>

      <ScrollView style={styles.cartList} showsVerticalScrollIndicator={false}>
        {cart.items.map((item, index) => (
          <View key={`${item.productId._id}-${index}`} style={styles.cartItem}>
            <Image source={{ uri: item.productId.image }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.productId.name}</Text>
              <Text style={styles.itemPrice}>₹{(item.productId.price || 0).toFixed(2)}</Text>
            </View>
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => handleUpdateQuantity(item.productId._id, 'decrease')}
              >
                <Ionicons name="remove" size={20} color="#53B175" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => handleUpdateQuantity(item.productId._id, 'increase')}
              >
                <Ionicons name="add" size={20} color="#53B175" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>₹{cart?.totalPrice}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
          <Text style={styles.summaryValue}>₹{deliveryFee}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{total}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={handlePayment}>
          <Text style={styles.checkoutButtonText}>Proceed to Payment</Text>
        </TouchableOpacity>
      </View>

      {showWebView && paymentData && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={showWebView}
          onRequestClose={() => {
            setShowWebView(false);
            setIsLoading(false);
          }}
        >
          <View style={{ flex: 1 }}>
            <WebView
              source={{
                html: `
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <style>
                        body { margin: 10; padding: 20px; font-family: Arial, sans-serif; }
                        .loading { text-align: center; margin-top: 20px; }
                      </style>
                    </head>
                    <body>
                      <div id="payment_div">
                        <p class="loading">Initializing payment...</p>
                      </div>
                      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
                      <script>
                        const options = ${JSON.stringify(paymentData)};
                        options.handler = function(response) {
                          window.ReactNativeWebView.postMessage(JSON.stringify({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                          }));
                        };
                        
                        options.modal = {
                          ondismiss: function() {
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                              error: { description: 'Payment cancelled by user' }
                            }));
                          }
                        };
                        
                        const rzp = new Razorpay(options);
                        
                        rzp.on('payment.failed', function(response) {
                          window.ReactNativeWebView.postMessage(JSON.stringify({
                            error: response.error
                          }));
                        });
                        
                        // Start payment automatically
                        setTimeout(function() {
                          rzp.open();
                        }, 1000);
                      </script>
                    </body>
                  </html>
                `
              }}
              onMessage={(event) => {
                const response = JSON.parse(event.nativeEvent.data);
                handlePaymentResponse(response);
              }}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn('WebView error: ', nativeEvent);
                Alert.alert('Error', 'Something went wrong with the payment. Please try again.');
                setShowWebView(false);
                setIsLoading(false);
              }}
              onHttpError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn('WebView HTTP error: ', nativeEvent);
                Alert.alert('Error', 'Network error. Please check your connection and try again.');
                setShowWebView(false);
                setIsLoading(false);
              }}
              style={{ flex: 1 }}
            />
            <TouchableOpacity
              style={[styles.closeWebView, { position: 'absolute', top: 40, right: 20 }]}
              onPress={() => {
                setShowWebView(false);
                setIsLoading(false);
              }}
            >
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </Modal>
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#181725',
  },
  itemCount: {
    fontSize: 16,
    color: '#7C7C7C',
  },
  cartList: {
    flex: 1,
  },
  cartItem: {
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
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 15,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181725',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#53B175',
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F3F2',
    borderRadius: 10,
    padding: 5,
  },
  quantityButton: {
    padding: 5,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181725',
    marginHorizontal: 10,
  },
  summary: {
    backgroundColor: '#FFF',
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#7C7C7C',
  },
  summaryValue: {
    fontSize: 16,
    color: '#181725',
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F2F3F2',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#181725',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#53B175',
  },
  checkoutButton: {
    backgroundColor: '#53B175',
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  checkoutButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    color: '#7C7C7C',
  },
  closeWebView: {
    backgroundColor: '#FFF',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});