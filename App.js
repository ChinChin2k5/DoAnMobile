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

import {UserProvider} from './context/UserContext';

export default function App() {
  return (
    // 
    // BỌC TOÀN BỘ ỨNG DỤNG BẰNG TỪ KHÓA <UserProvider>
    // Toàn bộ các Component nằm bên trong (bao gồm cả Navigation) 
    // đều sẽ nhận được dữ liệu từ API Context này
    // 
    <UserProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <AppNavigator />
      </NavigationContainer>
    </UserProvider>
  );
}