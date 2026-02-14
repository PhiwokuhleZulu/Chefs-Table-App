import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { loadMenu } from './fileSystemUtils';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const courseArray = [
  { id: 1, name: "Starters", count: 0 },
  { id: 2, name: "Main courses", count: 0 },
  { id: 3, name: "Desserts", count: 0 },
  { id: 4, name: "Sides", count: 0 },
];

interface MenuItem {
  id: string;
  dishName: string;
  description: string;
  price: string;
  course: string;
}

const ViewPageClient = () => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("All");

  useEffect(() => {
    const fetchMenu = async () => {
      const loadedMenu = await loadMenu();
      setMenu(loadedMenu);
    };
    fetchMenu();
  }, []);

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.menuItem}>
      <Text style={styles.dishName}>{item.dishName}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.price}>R{item.price}</Text>
    </View>
  );

  // ChatGpt helpd with the filtering of the menu courses
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

        
        <View style={styles.menuItemContainer}>
            <View style={styles.courseTitle}>
                <Text style={styles.courseTitleText}>{selectedCourse}</Text>
                <Text style={styles.itemCountText}>~{filteredMenu.length} available~</Text>
            </View>

            <FlatList
                data={filteredMenu}
                renderItem={renderMenuItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.menuList}
            />
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
    paddingHorizontal: 40,
    paddingVertical: 20,
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
  menuItemContainer: {
    height: 910,
  },
  selectedCourseText: {
    color: '#ffffff',
  },
  courseTitle: {
    alignSelf: 'center',
  },
  courseTitleText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,

  },
  menuList: {
    padding: 20,
  },
  menuItem: {
    backgroundColor: '#922544',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#770A29',
    padding: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    alignItems: 'center',
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: 'white',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  checkbox: {
    alignSelf: 'flex-end',
  },

  itemCountText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
  },
});

export default ViewPageClient;