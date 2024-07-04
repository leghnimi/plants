import { createContext, useEffect, useState } from "react";
import { HomeStackScreen, TabScreen } from "./components/AppNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MainStack = createStackNavigator();

export const AppContext = createContext();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [greenhouses, setGreenhouses] = useState([]);

  useEffect(() => {
    const _login = async () => {
      const _isAuthenticated = await AsyncStorage.getItem("isAuthenticated");
      if (_isAuthenticated) {
        setIsAuthenticated(true);
      }
    };
    _login();
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchGreenhouses = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_ENDPOINT}/api/greenhouses`
        );
        const data = await response.json();
        setGreenhouses(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchGreenhouses();
      
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (data) => {
    setIsAuthenticated(true);
    await AsyncStorage.setItem("isAuthenticated", "true");
    await AsyncStorage.setItem("user", JSON.stringify(data.user));
  };

  const logout = async () => {
    setIsAuthenticated(false);
    await AsyncStorage.removeItem("isAuthenticated");
    await AsyncStorage.removeItem("user");
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    greenhouses
  };

  return (
    <AppContext.Provider value={value}>
      <NavigationContainer>
        <MainStack.Navigator>
          {isAuthenticated ? (
            <MainStack.Screen
              name="TabScreen"
              component={TabScreen}
              options={{ headerShown: false }}
            />
          ) : (
            <MainStack.Screen
              name="HomeStack"
              component={HomeStackScreen}
              options={{ headerShown: false }}
            />
          )}
        </MainStack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
}
