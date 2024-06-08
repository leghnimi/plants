import HomeScreen from "../screens/HomeScreen";
import PlantsScreen from "../screens/PlantsScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import GreenhouseScreen from "../screens/GreenhouseScreen";
import WorkerInputScreen from "../screens/WorkerInputScreen";
import GreenhouseDetailsScreen from "../screens/GreenhouseDetails"
import RecoverPasswordScreen from "../screens/RecoverPasswordScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialCommunityIcons } from 'react-native-vector-icons';

const MainStack = createStackNavigator();
const HomeStack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="SignUp" component={SignupScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="GreenhouseDetails" component={GreenhouseDetailsScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="RecoverPassword" component={RecoverPasswordScreen} options={{ headerShown: false }} />
    </HomeStack.Navigator>
  );
}

function TabScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Plants') {
            iconName = focused ? 'flower' : 'flower-outline';
          } else if (route.name === 'Greenhouse') {
            iconName = focused ? 'tree' : 'tree-outline';
          } else if (route.name === 'WorkerInput') {
            iconName = focused ? 'clipboard-text' : 'clipboard-text-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: (route) => ({
          display: getTabBarVisibility(route),
        }),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false, title: 'Acceuil'}} />
      <Tab.Screen name="Plants" component={PlantsScreen} options={{ headerShown: false, title:'Ajout' }} />
      <Tab.Screen name="Greenhouse" component={GreenhouseScreen} options={{ headerShown: false, title: "Serres"}} />
      <Tab.Screen name="WorkerInput" component={WorkerInputScreen} options={{ headerShown: false, title: "Saisie des données"}} />
    </Tab.Navigator>
  );
}

// Function to determine tab bar visibility
const getTabBarVisibility = (route) => {
  const routeName = route.name;

  switch (routeName) {
    case 'Home':
    case 'GreenhouseDetails':
      return 'none';
    default:
      return 'flex';
  }
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <MainStack.Navigator>
        <MainStack.Screen name="HomeStack" component={HomeStackScreen} options={{ headerShown: false }} />
        <MainStack.Screen name="TabScreen" component={TabScreen} options={{ headerShown: false }} />
      </MainStack.Navigator>
    </NavigationContainer>
  );
}