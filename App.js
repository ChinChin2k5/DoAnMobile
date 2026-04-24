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

// ==========================================
// 1. IMPORT USERPROVIDER TỪ FILE VỪA TẠO
// LƯU Ý: Cần chỉnh sửa lại đường dẫn './context/UserContext' 
// cho khớp với vị trí lưu file thực tế trong dự án
// ==========================================
import {UserProvider} from './context/UserContext';

export default function App() {
  return (
    // ==========================================
    // 2. BỌC TOÀN BỘ ỨNG DỤNG BẰNG TỪ KHÓA <UserProvider>
    // Toàn bộ các Component nằm bên trong (bao gồm cả Navigation) 
    // đều sẽ nhận được dữ liệu từ Context này
    // ==========================================
    <UserProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <AppNavigator />
      </NavigationContainer>
    </UserProvider>
  );
}