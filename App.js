// import React from 'react';
// import AppNavigator from './navigation/AppNavigator';

// export default function App() {
//   return <AppNavigator />;
// }


//chỉnh sửa của DUY
// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <AppNavigator />
    </NavigationContainer>
  );
}