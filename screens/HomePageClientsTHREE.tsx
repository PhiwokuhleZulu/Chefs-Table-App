import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { loadOrders } from './fileSystemUtils';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

interface MenuItem {
  id: string;
  dishName: string;
  description: string;
  course: string;
}

interface Order {
  menuItems: MenuItem[];
  client: string;
  date: string;
  price: string;
}

const ClientOrderView = () => {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const loadedOrders = await loadOrders();
      // Third order
      setOrder(loadedOrders[2]);
    };
    fetchOrder();
  }, []);

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.menuItem}>
      <Text style={styles.courseTitle}>{item.course}</Text>
      <Text style={styles.dishName}>{item.dishName}:</Text>
      <Text style={styles.dishDescription}>{item.description}</Text>
    </View>
  );

  if (!order) return null;

  return (
    <SafeAreaProvider style={styles.container}>
      <Text style={styles.clientName}>{order.client}</Text>
      <Text style={styles.orderDate}>{order.date}</Text>

      <FlatList
        data={order.menuItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.menuList}
      />

      <View style={styles.totalPriceContainer}>
        <Text style={styles.totalPriceText}>Total Price</Text>
        <Text style={styles.totalPriceAmount}>R67,99</Text>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#152238',
    padding: 20,
  },
  clientName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  orderDate: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  menuList: {
    flexGrow: 1,
  },
  menuItem: {
    marginBottom: 20,
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  dishName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  dishDescription: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  totalPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#922544',
    padding: 15,
    borderRadius: 10,
  },
  totalPriceText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPriceAmount: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ClientOrderView;