// App.js
import React, { useEffect, useContext, useState } from 'react';
import { Platform, View, ActivityIndicator, Text } from 'react-native'; // Đã thêm Text vào đây!
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { UserProvider, UserContext } from './context/UserContext';
import { onAuthStateChanged, getRedirectResult } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

async function getOrCreateUser(uid, displayName, email) {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return {
      role: userSnap.data().role || 'student',
      fullName: userSnap.data().fullName || displayName || 'Người dùng',
    };
  }
  const newData = {
    uid,
    fullName: displayName || 'Người dùng',
    email: (email || '').toLowerCase(),
    role: 'student',
    createdAt: serverTimestamp(),
  };
  await setDoc(userRef, newData);
  return { role: newData.role, fullName: newData.fullName };
}

// Kiểm tra Role khác ngoài student (Đã dùng nav.reset như bạn yêu cầu)
function navigateByRole(nav, role) {
  if (!nav || !nav.isReady()) return;
  
  if (role === 'teacher' || role === 'admin') {
    nav.reset({ index: 0, routes: [{ name: 'MainTabsAdmin' }] });
  } else {
    nav.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  }
}

// ── AuthHandler: chạy ở root, luôn mount đầu tiên ──
function AuthHandler({ navigationRef }) {
  const { setUserName, setUserRole } = useContext(UserContext);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Lắng nghe trạng thái đăng nhập
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const { role, fullName } = await getOrCreateUser(
            user.uid,
            user.displayName,
            user.email
          );
          setUserName(fullName);
          setUserRole(role);

          // Đợi Navigation sẵn sàng rồi mới chuyển trang
          const checkNav = setInterval(() => {
            if (navigationRef.current?.isReady()) {
              clearInterval(checkNav);
              navigateByRole(navigationRef.current, role);
              // CHỈ tắt loading sau khi đã điều hướng xong
              setChecking(false);
            }
          }, 100);

          return; // Thoát để không chạy setChecking(false) ở cuối
        } catch (err) {
          console.error('[App] Auto-login error:', err);
        }
      }

      // Nếu thực sự không có user (sau khi Firebase đã check xong)
      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  // Trong khi đang check, luôn hiển thị màn hình chờ, không cho AppNavigator hiện ra
  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#1d4ed8" />
        <Text style={{ marginTop: 10, color: '#64748b' }}>Đang xác thực phiên làm việc...</Text>
      </View>
    );
  }

  return null;
}

export default function App() {
  const navigationRef = React.useRef(null);

  return (
    <UserProvider>
      <NavigationContainer ref={navigationRef}>
        <StatusBar style="auto" />
        <AuthHandler navigationRef={navigationRef} />
        <AppNavigator />
      </NavigationContainer>
    </UserProvider>
  );
}