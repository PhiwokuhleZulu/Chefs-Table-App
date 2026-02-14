import {useState, useEffect} from 'react'
import { 
  StyleSheet, 
  Text, 
  View,
  TextInput,
  TouchableOpacity,
  Button,
  FlatList,
  StatusBar,
  Alert,
 } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system/legacy'              //Handles file reading and writing for local storage
//import {documentDirectory} from 'expo-file-system/legacy'
import { ScrollView } from 'react-native-gesture-handler';

// File path to store the menu data locally in the app
const MENU_FILE_PATH =FileSystem.documentDirectory + 'menu.json'
//const MENU_FILE_PATH = documentDirectory + 'menu.json';

// Array of course categories for the dropdown picker options
const courseArray = [
  {id: 1, name: "Starters", count: 0},
  {id: 2, name: "Main courses", count: 0},
  {id: 3, name: "Desserts", count: 0},
  {id: 4, name: "Sides", count: 0},
]

// Giving the structure for each menu item with id, dishname, description, price and course
interface Menu {
  id: string,
  dishName: string,
  description: string,
  price: string,
  course: string,
}


const EditMenu =  () => {

  // Utilizing state variables to get input variables to add new menu items
    const [dishName, setDishName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [course, setCourse] = useState<string>(''); 
    const [menu, setMenu] = useState<Menu[]>([]); // Storing list of current items loaded from the JSON file

    // Loading the menu items from the local file
    const loadMenu = async ()=> {
      try{
        const fileInfo = await FileSystem.getInfoAsync(MENU_FILE_PATH);
        // If the file exists it reads and parses the content into the menu state
        if (fileInfo.exists) {
          const fileContent = await FileSystem.readAsStringAsync(MENU_FILE_PATH);
          setMenu(JSON.parse(fileContent));
        }
      } catch (error) {
        console.error('Error loading menu items', error);
      }
    };

    useEffect(()=>{
      loadMenu();
    }, []);

    // Adding new menu items
    const handleAddItem = async ()=> {
      // Checking if all the text fields are filled with error handling
      if (!dishName || !description || !price || !course) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      // Creating new menu item
      const newItem: Menu = {
        id: Date.now().toString(),
        dishName,
        description,
        price,
        course,
      }

      // Updating the menu array 
      const updatedMenu = [...menu, newItem];

      // Saving the menu back to the file
      try {
        await FileSystem.writeAsStringAsync(MENU_FILE_PATH, JSON.stringify(updatedMenu));
        setMenu(updatedMenu);
        
        // Clearing the text fields
        setDishName('');
        setDescription('');
        setPrice('');
        setCourse('');
      } catch (error) {
        console.error('Error saving menu item: ', error);
      }

    };

    //Rendering the Menu items
    const renderMenu = ({ item }: { item: Menu }) => (
      // This will dispay the list of menu items useing the Flatlist, and each item
      // shows its dishName, description, price, and course with a delete button.
      <View style={styles.menuItemContainer}>
        <Text style={styles.title}>{item.dishName}</Text>
        <Text style={styles.item}>{item.description} - R{item.price} - {item.course}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={()=> handleDeleteMenuItem(item.id)}
        >
          <Text style={styles.item}>Delete</Text>
        </TouchableOpacity>
      </View>
    ); 

    //DeleteButton Logic
    const handleDeleteMenuItem = async (id: string) => {
      // This function removes an item from the menu by filtering out the item with the matching id,
      // updates the state,and saves the updated list to the file
      const updatedMenu = menu.filter(menuItem => menuItem.id !== id);

      try {
        await FileSystem.writeAsStringAsync(MENU_FILE_PATH, JSON.stringify(updatedMenu));
        setMenu(updatedMenu);
      } catch (error) {
        console.error('Error deleting menu item: ', error);
      }
    };

    return(
        <SafeAreaProvider style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Add Menu Item</Text>
            </View>

            <View style={styles.inputContainer}>
              {/* Fields for entering the text inputs for the meny details*/}
                <TextInput 
                    style={styles.input}
                    placeholder='Dish name'
                    placeholderTextColor={'#D7D7D7'}
                    value={dishName}
                    onChangeText={setDishName}
                />
                <TextInput 
                    style={styles.input}
                    placeholder='Description'
                    placeholderTextColor={'#D7D7D7'}
                    value={description}
                    onChangeText={setDescription}
                />
                <TextInput 
                    style={styles.input}
                    placeholder='Price'
                    placeholderTextColor={'#D7D7D7'}
                    value={price}
                    onChangeText={setPrice}
                    keyboardType='numeric'
                    returnKeyType='done'
                />

                {/* Dropdown for selecting the course of the dish*/}
                <Picker
                    selectedValue={course}
                    onValueChange={(itemValue) => setCourse(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Select a course" value="" />
                    {courseArray.map((item) => (
                      <Picker.Item label={item.name} value={item.name} key={item.id} />
                    ))}
                </Picker>

                {/* Button that handles the savign of new menu items*/}
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText} onPress={handleAddItem}>SAVE</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.listContainer}>
                <Text style={styles.listHeader}>Menu List:</Text>

                <FlatList
                    data={menu}
                    renderItem={renderMenu}
                    keyExtractor={item => item.id}
                />
            </View>

        </SafeAreaProvider>
    )
};

// Styling for the Edit Page for the Chef
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#152238",
  },
  header: {
    backgroundColor: "#11213C",
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  headerText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 28,
    color: 'white',
  },
  inputContainer: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#1D2F4F',
    color: 'white',
    fontSize: 16,
    
  },
  picker: {
    borderWidth: 1,
    borderColor: '#922544',
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#1D2F4F',
    color: 'white',
  },
  button: {
    padding: 15,
    backgroundColor: '#922544',
    alignSelf: 'center',
    borderRadius: 8,
    width: '60%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listContainer: {
    padding:20,
  },
  listHeader: {
    color: 'white',
    fontSize: 24,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  menuItemContainer: {
    borderWidth: 1,
    padding: 15,
    borderColor: '#922544',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: 'rgba(146, 37, 68, 0.1)',
  },
  item: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  title: {
    color: 'white',
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#922544',
    marginTop: 10,
    borderRadius: 5,
    alignSelf: 'flex-end',
    width: '30%',
  },
});

export default EditMenu;