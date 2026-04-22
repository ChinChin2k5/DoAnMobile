import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
//Thư viện tránh tai thỏ
import { SafeAreaProvider } from "react-native-safe-area-context";

import AdminChartScreen from "./src/screens/AdminChartScreen";
import AdminConfigScreen from "./src/screens/AdminConfigScreen";
import AdminDashboardScreen from "./src/screens/AdminDashboardScreen";
import LoadingScreen from "./src/screens/LoadingScreen";
import SandboxScreen from "./src/screens/SandboxScreen";
import Onboarding1 from "./src/screens/Onboarding1";

//Khoi tao Stack Navigator
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {/*Quy dinh man hinh nao se duoc bat len dau tien*/}
        <Stack.Navigator initialRouteName="FirstOnboarding">
          {/*Khai bao tung man hinh mot*/}
          <Stack.Screen
            name="Loading"
            component={LoadingScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Sandbox"
            component={SandboxScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="DashboardAdmin"
            component={AdminDashboardScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ChartAdmin"
            component={AdminChartScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ConfigAdmin"
            component={AdminConfigScreen}
            //Tắt header mặc định của react đi
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="FirstOnboarding"
            component={Onboarding1}
            //Tắt header mặc định của react đi
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
