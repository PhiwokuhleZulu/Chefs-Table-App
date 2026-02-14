import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';
import { Picker } from '@react-native-picker/picker';
import { loadMenu, loadOrders, saveOrders } from './fileSystemUtils';
import * as FileSystem from 'expo-file-system/legacy'

const ORDERS_FILE_PATH =FileSystem.documentDirectory + 'orders.json'

const courseArray = [
  { id: 1, name: "Starters", count: 0 },
  { id: 2, name: "Main courses", count: 0 },
  { id: 3, name: "Desserts", count: 0 },
  { id: 4, name: "Sides", count: 0 },
];

const clients = ["Tshepo", "Marie", "Luyanda"];

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

const ChefsViewPage = () => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("All");
  const [selectedClient, setSelectedClient] = useState<string>(clients[0]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedItems, setSelectedItems] = useState<{[key: string]: boolean}>({});

  // useEffect(() => {
  //   const fetchMenu = async () => {
  //     const loadedMenu = await loadMenu();
  //     setMenu(loadedMenu);
  //   };
  //   fetchMenu();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      const loadedMenu = await loadMenu();
      setMenu(loadedMenu);
      const loadedOrders = await loadOrders();
      setOrders(loadedOrders);
    };
    fetchData();
  }, []);

  const saveOrder = async () => {
    // const newOrder: Order = {
    //   menuItems: menu.filter(item => selectedItems[item.id]),
    //   client: selectedClient,
    //   date: selectedDate,
    // };
    // setOrders([...orders, newOrder]);

    const newOrder: Order = {
      menuItems: menu.filter(item => selectedItems[item.id]),
      client: selectedClient,
      date: selectedDate,
    };
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    
    try {
      await saveOrders(updatedOrders);
      Alert.alert("Success", "Order saved successfully!");
    } catch (error) {
      console.error('Error saving order:', error);
      Alert.alert("Error", "Failed to save order. Please try again.");
    }
    // Reset selections
    setSelectedItems({});
    setSelectedClient(clients[0]);
    setSelectedDate('');
    Alert.alert("Success", "Order saved successfully!");
  };

  // const fetchOrdersFromFileSystem = async () => {  
  //   try {
  //     const fileInfo = await FileSystem.getInfoAsync(ORDERS_FILE_PATH);
  
  //     if (fileInfo.exists) {
  //       const fileContent = await FileSystem.readAsStringAsync(ORDERS_FILE_PATH);
  //       setOrders(JSON.parse(fileContent));
  //     }
  //   } catch (error) {
  //     console.error('Error loading orders', error);
  //   }
  // };
  
  // useEffect(() => {
  //   fetchOrdersFromFileSystem();  // Call the renamed function
  // }, []);

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => ({...prev, [itemId]: !prev[itemId]}));
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.menuItem}>
      <View style={styles.itemContainer}>
        <Text style={styles.dishName}>{item.dishName}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.price}>R{item.price}</Text>
      </View>
      <View style={styles.itemCheckBox}>
        <Checkbox
          value={selectedItems[item.id] || false}
          onValueChange={() => toggleItemSelection(item.id)}
          color={selectedItems[item.id] ? '#922544' : undefined}
        />
      </View>
    </View>
  );

  const filteredMenu = selectedCourse === "All" 
    ? menu 
    : menu.filter(item => item.course === selectedCourse);

  return (
    <SafeAreaProvider style={styles.safeArea}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabContainer}
      >
        <TouchableOpacity
          style={[styles.courseButton, selectedCourse === "All" && styles.selectedCourseButton]}
          onPress={() => setSelectedCourse("All")}
        >
          <Text style={[styles.courseText, selectedCourse === "All" && styles.selectedCourseText]}>All</Text>
        </TouchableOpacity>
        
        {courseArray.map((course) => (
          <TouchableOpacity
            key={course.id}
            style={[styles.courseButton, selectedCourse === course.name && styles.selectedCourseButton]}
            onPress={() => setSelectedCourse(course.name)}
          >
            <Text style={[styles.courseText, selectedCourse === course.name && styles.selectedCourseText]}>{course.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.menuItemsContainer}>
        <View style={styles.courseTitle}>
          <Text style={styles.courseTitleText}>{selectedCourse}</Text>
        </View>

        <FlatList
          data={filteredMenu}
          renderItem={renderMenuItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.menuList}
        />
      </View>

      <View style={styles.orderSection}>
        <Picker
          selectedValue={selectedClient}
          onValueChange={(itemValue) => setSelectedClient(itemValue)}
          style={styles.picker}
        >
          {clients.map((client) => (
            <Picker.Item key={client} label={client} value={client} />
          ))}
        </Picker>
        
        <TextInput
          value={selectedDate}
          onChangeText={setSelectedDate}
          placeholder="Enter date (e.g., 2024-09-15)"
          style={styles.dateInput}
        />
        
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={saveOrder}
          disabled={Object.values(selectedItems).filter(Boolean).length === 0}
        >
          <Text style={styles.saveButtonText}>Save Order</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#152238',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#152238',
    padding: 10,
  },
  courseButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  selectedCourseButton: {
    backgroundColor: '#922544',
  },
  courseText: {
    color: '#333333',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedCourseText: {
    color: '#ffffff',
  },
  menuItemsContainer: {
    height: 720,
  },
  courseTitle: {
    alignSelf: 'center',
    marginVertical: 10,
  },
  courseTitleText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  menuList: {
    padding: 10,
  },
  menuItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 5,
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemContainer: {
    flex: 1,
  },
  itemCheckBox: {
    marginLeft: 10,
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4a6572',
  },
  picker: {
    height: 50,
    backgroundColor: '#2c3e50',
    color: 'white',
    marginBottom: 10,
  },
  dateInput: {
    height: 40,
    borderColor: '#4a6572',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    borderRadius: 5,
  },
  orderSection: {
    padding: 20,
    backgroundColor: '#1a2a3a',
  },
  saveButton: {
    backgroundColor: '#922544',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChefsViewPage;