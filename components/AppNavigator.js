import HomeScreen from "../screens/HomeScreen";
import PlantsScreen from "../screens/PlantsScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import GreenhouseScreen from "../screens/GreenhouseScreen";
import WorkerInputScreen from "../screens/WorkerInputScreen";
import GreenhouseDetailsScreen from "../screens/GreenhouseDetails";
import RecoverPasswordScreen from "../screens/RecoverPasswordScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const getTabBarVisibility = (route) => {
  const routeName = route.name;

  switch (routeName) {
    case "Home":
    case "GreenhouseDetails":
      return "none";
    default:
      return "flex";
  }
};

export function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="SignUp"
        component={SignupScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="GreenhouseDetails"
        component={GreenhouseDetailsScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="RecoverPassword"
        component={RecoverPasswordScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="GreenHouse"
        component={GreenhouseScreen}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
}

export function TabScreen() {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const checkRole = async () => {
      const user = await AsyncStorage.getItem("user");
      if (user) {
        const _user = JSON.parse(user);
        if (_user.role === "admin") {
          setIsAdmin(true);
        }
      }
    };
    checkRole();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Plants") {
            iconName = focused ? "flower" : "flower-outline";
          } else if (route.name === "Greenhouse") {
            iconName = focused ? "tree" : "tree-outline";
          } else if (route.name === "WorkerInput") {
            iconName = focused ? "clipboard-text" : "clipboard-text-outline";
          } else if (route.name === "AddUser") {
            iconName = focused
              ? "account-supervisor"
              : "account-supervisor-outline";
          }

          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: (route) => ({
          display: getTabBarVisibility(route),
        }),
      })}
    >
      <Tab.Screen
        name="Plants"
        component={PlantsScreen}
        options={{ headerShown: false, title: "Ajout" }}
      />
      <Tab.Screen
        name="Greenhouse"
        component={GreenhouseScreen}
        options={{ headerShown: false, title: "Serres" }}
      />
      <Tab.Screen
        name="WorkerInput"
        component={WorkerInputScreen}
        options={{ headerShown: false, title: "Saisie des données" }}
      />
      {isAdmin && (
        <Tab.Screen
          name="AddUser"
          component={SignupScreen}
          options={{ headerShown: false, title: "Ajout utilisateur" }}
        />
      )}
    </Tab.Navigator>
  );
}
