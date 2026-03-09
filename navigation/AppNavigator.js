import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import các màn hình từ thư mục Screens
import HomeScreen from '../Screens_Duy/LandingScreens';
import TestScreen from '../Screens_Duy/TestScreen'  ;
import AuthScreen from '../Screens_Duy/AuthScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      {/* screenOptions={{ headerShown: false }} để ẩn thanh tiêu đề mặc định của ứng dụng */}
      <Stack.Navigator initialRouteName="Home" 
      screenOptions={{ headerShown: false }}>
        {/*Màn hình LandingPage được đặt tên là: "Home"
        Component lấy từ: 
        export default function HomeScreen({navigation}) */}
        <Stack.Screen 
        name="Home" 
        component={HomeScreen} />
        {/*Màn hình TestScreen được đặt tên là: "Test"
        Component lấy từ: export default function TestScreen*/}
        <Stack.Screen 
        name="Test" 
        component={TestScreen} />
        {/*Màn hình TestScreen được đặt tên là: "Auth"
        Component lấy từ: export default function AuthScreen*/}
        <Stack.Screen 
        name='Auth'
        component={AuthScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}