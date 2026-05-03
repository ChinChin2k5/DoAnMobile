import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { UserProvider } from './context/UserContext';
import './i18n';

export default function App() {
  // 1. Load Font chữ
  const [fontsLoaded] = useFonts({
    'Inter-Regular': require('./src/assets/fonts/Inter_18pt-Regular.ttf'),
    'Inter-Medium': require('./src/assets/fonts/Inter_18pt-Medium.ttf'), 
    'Inter-ExtraBold': require('./src/assets/fonts/Inter_18pt-ExtraBold.ttf'),
    'Inter-Italic': require('./src/assets/fonts/Inter_18pt-Italic.ttf'),
  });

  // 2. CHỐT CHẶN AN TOÀN: Chờ font tải xong mới cho App chạy
  if (!fontsLoaded) {
    return null; 
  }

  // 3. Render giao diện chính
  return (
    <UserProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <AppNavigator />
      </NavigationContainer>
    </UserProvider>
  );
}

