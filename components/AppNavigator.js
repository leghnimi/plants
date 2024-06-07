import HomeScreen from "../screens/HomeScreen";
import PlantsScreen from "../screens/PlantsScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import GreenhouseScreen from "../screens/GreenhouseScreen";
import GreenhouseDetails from "../screens/GreenhouseDetails";
import WorkerInputScreen from "../screens/WorkerInputScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";


export default function AppNavigator() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Plants" component={PlantsScreen} options={{ headerShown: true, title:'Gestion Serres' }} />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUpScreen"
          component={SignupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Greenhouse"
          component={GreenhouseScreen}
          options={{ headerShown: true, title: "Serres"}}
        />
        <Stack.Screen
          name="GreenhouseDetails"
          component={GreenhouseDetails}
          options={{ headerShown: true, title: "Détails Serre"}}
        />
        <Stack.Screen
          name="WorkerInput"
          component={WorkerInputScreen}
          options={{ headerShown: true, title: "Saisie des données"}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}