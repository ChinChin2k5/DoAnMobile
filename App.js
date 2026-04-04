import * as React from 'react';
import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AdminChartScreen from './src/screens/AdminChartScreen';
import AdminConfigScreen from './src/screens/AdminConfigScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';

//Khoi tao Stack Navigator
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      {/*Quy dinh man hinh nao se duoc bat len dau tien*/}
      <Stack.Navigator initialRouteName='ChartAdmin'>
        {/*Khai bao tung man hinh mot*/}
        <Stack.Screen
          name = "DashboardAdmin"
          component={AdminDashboardScreen}
        />
        <Stack.Screen
          name = "ChartAdmin"
          component={AdminChartScreen}
        />
        <Stack.Screen
          name = "ConfigAdmin"
          component={AdminConfigScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}