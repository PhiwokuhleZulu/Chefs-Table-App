import 'react-native-gesture-handler';
import * as React from 'react';
import { Button, View, TouchableOpacity, ImageBackground, StyleSheet, Text } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePageClient from './screens/HomePageClient';
import ViewPageClient from './screens/ViewPageClient';
import ChefsHomePage from './screens/ChefsHomePage';
import ChefsViewPage from './screens/ChefsViewPage';
import ChefsEditPage from './screens/ChefsEditPage';
import HomePageClientTWO from './screens/HomePageClientsTWO';
import HomePageClientTHREE from './screens/HomePageClientsTHREE';

// Defining navigation parameteres 
type DrawerParamList = {
  Home: undefined;
  Menu: undefined;
  HomePage: undefined;
  ViewList: undefined;
  Modify: undefined;
  Logout: undefined;
};

type RootStackParamList = {
  Login: undefined;
  ClientApp: undefined;
  ClientApp2: undefined;
  ClientApp3: undefined;
  ChefApp: undefined;
};

// Handling app navigation structures with the drawer and stack
const Drawer = createDrawerNavigator<DrawerParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();


// Interface for client1, Tshepo utilizing drawer component
const ClientApp = () => (
  <Drawer.Navigator>
    <Drawer.Screen name='Home' component={HomePageClient}/>
    <Drawer.Screen name='Menu' component={ViewPageClient}/>
  </Drawer.Navigator>
);

// Interface for client2, Luyanda utilizing drawer component
const ClientApp2 = () => (
  <Drawer.Navigator>
    <Drawer.Screen name='Home' component={HomePageClientTWO}/>
    <Drawer.Screen name='Menu' component={ViewPageClient}/>
  </Drawer.Navigator>
);

// Interface for client3, Marie utilizing drawer component
const ClientApp3 = () => (
  <Drawer.Navigator>
    <Drawer.Screen name='Home' component={HomePageClientTHREE}/>
    <Drawer.Screen name='Menu' component={ViewPageClient}/>
  </Drawer.Navigator>
);

// The Chefs drawer-based component for their interface. With three screens such as 
// the HomePage, ViewList, and Modify screens.
const ChefApp = () => (
  <Drawer.Navigator>
    <Drawer.Screen name='HomePage' component={ChefsHomePage}/>
    <Drawer.Screen name='ViewList' component={ChefsViewPage}/>
    <Drawer.Screen name='Modify' component={ChefsEditPage}/>
  </Drawer.Navigator>
);

type ScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

// Displaying a login screen with navigation buttons for selecting between the Chef and 
// different Clients (Tshepo, Luynada, and Marie)
function LoginScreen({ navigation }: ScreenProps) {

  return(
    <ImageBackground
      source={require('./assets/ChefsTable-background.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
      <Text style={styles.title}>Chef's Table</Text>
      <View style={styles.buttonContainer}>

        <TouchableOpacity
          style={styles.chefButton}
          
          onPress={() => navigation.navigate('ChefApp')}
        >
          <Text style={styles.buttonText}>Chef</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ClientApp')}
        >
          <Text style={styles.buttonText}>Tshepo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ClientApp2')}
        >
          <Text style={styles.buttonText}>Luyanda</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ClientApp3')}
        >
          <Text style={styles.buttonText}>Marie</Text>
        </TouchableOpacity>
      </View>
    </View>
    </ImageBackground>
  );
}

// Wraps the app's navigation structure within NavigationContainer, 
// defining the stack flow starting from the Login screen.
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Login' component={LoginScreen}/>
        <Stack.Screen name='ClientApp' component={ClientApp}/>
        <Stack.Screen name='ClientApp2' component={ClientApp2}/>
        <Stack.Screen name='ClientApp3' component={ClientApp3}/>

        <Stack.Screen name='ChefApp' component={ChefApp}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styling for the Login Screen
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 90,
  },
  buttonContainer: {
    width: '50%',
  },
  chefButton: {
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 10,
    borderWidth: 5,
    borderColor: '#922544',
    marginBottom: 80,
    marginTop: 50,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 10,
    borderWidth: 5,
    borderColor: '#152238',
    marginBottom: 20,
  },
});
