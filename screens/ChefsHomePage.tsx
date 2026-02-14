import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import { loadOrders } from './fileSystemUtils';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

interface MenuItem {
  id: string;
  dishName: string;
  description: string;
  price: string;
  course: string;
}

interface Order {
  menuItems: MenuItem[];
  client: string;
  date: string;
}

const { width: screenWidth } = Dimensions.get('window');

const ChefsViewPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const loadedOrders = await loadOrders();
      setOrders(loadedOrders);
    };
    fetchOrders();
  }, []);

  const renderClientItem = ({ item }: { item: Order }) => {
    return (
      <View style={styles.clientInfo}>
        <Text style={styles.clientName}>{item.client}</Text>
        <Text style={styles.clientDate}>{item.date}</Text>
        <Text style={styles.menuText}>Menu Items:</Text>
        {item.menuItems.map(menuItem => (
                <View key={menuItem.id}>
                <Text style={styles.menuItemName}>
                  {menuItem.dishName}
                </Text>
                <Text style={styles.menuItemDescription}>
                  {menuItem.description}
                </Text>
              </View>
            ))}
      </View>
    );
  };

  return (
    <SafeAreaProvider style={styles.appContainer}>
      <View style={styles.clientSection}>
        <Text style={styles.title}>Client Orders</Text>
        <View style={styles.divider} />
        <FlatList
          data={orders}
          renderItem={renderClientItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={true}
          snapToInterval={screenWidth - 40} // Adjust based on padding
          decelerationRate="fast"
          contentContainerStyle={styles.carouselContainer}
        />
      </View>      
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#152238'
  },
  clientSection: {
    height: 900,
  },
  carouselContainer: {
    paddingHorizontal: 10,
  },
  clientInfo: {
    width: screenWidth - 40,
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  menuText: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clientDate: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'white',
  },
  menuItemText: {
    fontSize: 14,
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#000000',
    width: '100%',
    marginVertical: 10,
  },

  menuItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    alignSelf: 'center',
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    alignSelf: 'center',
  },
});

export default ChefsViewPage;