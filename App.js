// App.js
import React, { useEffect, useContext, useState, useRef, useCallback } from 'react';
import { Platform, View, ActivityIndicator, Text, AppState } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { UserProvider, UserContext } from './context/UserContext';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Import ConfigContext ──
import { ConfigContext, DEFAULT_CONFIG } from './context/ConfigContext';

// ─────────────────────────────────────────────
// Hằng số key AsyncStorage
// Tách biệt hoàn toàn với key của Firebase Auth
// ─────────────────────────────────────────────
const LAST_ACTIVE_KEY = 'atoza_last_active'; // timestamp lần chạm cuối
const SESSION_UID_KEY = 'atoza_session_uid';  // uid đang đăng nhập (để verify)

// ─────────────────────────────────────────────
// Hàm lấy thông tin user từ Firestore
// ─────────────────────────────────────────────
async function getOrCreateUser(uid, displayName, email) {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return {
      role: userSnap.data().role || 'Học sinh',
      fullName: userSnap.data().fullName || displayName || 'Người dùng',
    };
  }
  const newData = {
    uid,
    fullName: displayName || 'Người dùng',
    email: (email || '').toLowerCase(),
    role: 'Học sinh',
    createdAt: serverTimestamp(),
  };
  await setDoc(userRef, newData);
  return { role: newData.role, fullName: newData.fullName };
}

// ─────────────────────────────────────────────
// Hàm điều hướng theo role
// ─────────────────────────────────────────────
function navigateByRole(nav, role) {
  if (!nav || !nav.isReady()) return;
  if (role === 'Giáo viên' || role === 'Admin') {
    nav.reset({ index: 0, routes: [{ name: 'MainTabsAdmin' }] });
  } else {
    nav.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  }
}

// ─────────────────────────────────────────────
// Hàm điều hướng về Login — dùng chung cho mọi trường hợp đăng xuất
// ─────────────────────────────────────────────
function navigateToLogin(nav) {
  if (!nav || !nav.isReady()) return;
  nav.reset({ index: 0, routes: [{ name: 'Login' }] });
}

// ─────────────────────────────────────────────
// AuthHandler
// Xử lý: auth state, load config, inactivity timer
// ─────────────────────────────────────────────
function AuthHandler({ navigationRef, setConfig, recordActivityRef }) {
  const { setUserName, setUserRole } = useContext(UserContext);
  const config = useContext(ConfigContext); //biến đọc config thay đổi hệ thống có trong 'firebase'

  const [checking, setChecking] = useState(true);

  // ── Refs để timer không bị stale closure ──
  const timerRef        = useRef(null);   // setTimeout handle
  const appStateRef     = useRef(AppState.currentState); // trạng thái foreground/background
  const isLoggedInRef   = useRef(false);  // có user đang đăng nhập không
  const configRef       = useRef(config); // ref của config để dùng trong callback

  // Đồng bộ configRef mỗi khi config thay đổi (tránh stale closure)
  useEffect(() => { configRef.current = config; }, [config]);

  // ─────────────────────────────────────────────
  // signOutDueToInactivity()
  // Gọi khi hết timeout — xoá storage, đăng xuất, về Login
  // ─────────────────────────────────────────────
  const signOutDueToInactivity = useCallback(async () => {
    console.log(' [TIMEOUT] Phiên hết hạn — Thực hiện đăng xuất tự động');
    clearTimeout(timerRef.current);
    isLoggedInRef.current = false;
    await AsyncStorage.multiRemove([LAST_ACTIVE_KEY, SESSION_UID_KEY]);
    await signOut(auth);
    navigateToLogin(navigationRef.current);
  }, [navigationRef]);

  // ─────────────────────────────────────────────
  // scheduleTimeout(remainingMs)
  // Đặt/reset timer với số ms còn lại
  // ─────────────────────────────────────────────
  const scheduleTimeout = useCallback((remainingMs) => {
    clearTimeout(timerRef.current);
    console.log(` [TIMER] Đã đặt bộ đếm: Sẽ đăng xuất sau ${Math.round(remainingMs / 1000)} giây`);
    timerRef.current = setTimeout(signOutDueToInactivity, remainingMs);
  }, [signOutDueToInactivity]);

  // ─────────────────────────────────────────────
  // recordActivity()
  // Gọi mỗi khi user chạm màn hình:
  //   1. Ghi lastActiveAt mới vào AsyncStorage
  //   2. Reset timer về secTimeout đầy đủ
  // ─────────────────────────────────────────────
  const recordActivity = useCallback(async () => {
    if (!isLoggedInRef.current) return;
    const now = Date.now();
    await AsyncStorage.setItem(LAST_ACTIVE_KEY, String(now));
    const timeoutMinutes = parseInt(configRef.current.secTimeout, 10) || 30;
    const timeoutMs = timeoutMinutes * 60 * 1000;
    
    console.log(` [ACTION] Thao tác chạm - Reset timer về ${timeoutMinutes} phút`);
    scheduleTimeout(timeoutMs);
  }, [scheduleTimeout]);

  // ─────────────────────────────────────────────
  // startSessionTimer(uid)
  // Gọi ngay sau khi xác nhận user đăng nhập thành công.
  // Đọc lastActiveAt từ AsyncStorage:
  //   - Không có / uid khác, đổi tài khoản khác  → phiên mới, ghi mới, timer reset đầy đủ
  //   - Còn hạn sau khi reload trang/ auto-login              → timer tiếp tục từ thời điểm còn lại
  //   - Hết hạn, máy tính sập nguồn, mất điện, mất wifi              → signOut ngay
  // ─────────────────────────────────────────────
  const startSessionTimer = useCallback(async (uid) => {
    const timeoutMs = (parseInt(configRef.current.secTimeout, 10) || 30) * 60 * 1000;
    const now = Date.now();

    try {
      const [lastActiveRaw, savedUid] = await AsyncStorage.multiGet([
        LAST_ACTIVE_KEY,
        SESSION_UID_KEY,
      ]).then(pairs => pairs.map(p => p[1]));

      const lastActive = lastActiveRaw ? parseInt(lastActiveRaw, 10) : null;
      const elapsed    = lastActive ? now - lastActive : null;
      const isSameUser = savedUid === uid;

      if (!lastActive || !isSameUser) {
        // ── Phiên mới (đăng nhập thủ công hoặc đổi tài khoản) ──
        console.log('[Timer] Phiên mới — bắt đầu đếm', timeoutMs / 60000, 'phút');
        await AsyncStorage.multiSet([
          [LAST_ACTIVE_KEY, String(now)],
          [SESSION_UID_KEY, uid],
        ]);
        scheduleTimeout(timeoutMs);

      } else if (elapsed >= timeoutMs) {
        // ── Đã hết hạn khi app còn tắt (máy sập, mất điện...) ──
        console.log('[Timer] Phiên đã hết hạn khi app tắt — đăng xuất ngay');
        await signOutDueToInactivity();

      } else {
        // ── App reload / auto-login — còn thời gian, tiếp tục đếm ──
        const remaining = timeoutMs - elapsed;
        console.log('[Timer] Tiếp tục phiên — còn', Math.round(remaining / 1000), 'giây');
        scheduleTimeout(remaining);
      }
    } catch (err) {
      // Lỗi đọc AsyncStorage → an toàn hơn là bắt đầu timer mới
      console.error('[Timer] Lỗi đọc AsyncStorage:', err);
      await AsyncStorage.multiSet([
        [LAST_ACTIVE_KEY, String(now)],
        [SESSION_UID_KEY, uid],
      ]);
      scheduleTimeout(timeoutMs);
    }
  }, [scheduleTimeout, signOutDueToInactivity]);

  // ─────────────────────────────────────────────
  // Xử lý AppState: foreground / background
  // Khi vào nền → xoá timer (không cần chạy)
  // Khi ra nền  → đọc lại lastActiveAt, tính elapsed, resume hoặc signOut
  // ─────────────────────────────────────────────
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextState) => {
      const prev = appStateRef.current;
      appStateRef.current = nextState;

      if (!isLoggedInRef.current) return;

      if (nextState === 'background' || nextState === 'inactive') {
        // App vào nền → ghi thời điểm, tạm dừng timer
        console.log('[AppState] Vào nền — pause timer local và lưu timestamp');
        await AsyncStorage.setItem(LAST_ACTIVE_KEY, String(Date.now()));
        clearTimeout(timerRef.current);

      } else if (nextState === 'active' && (prev === 'background' || prev === 'inactive')) {
        // App ra nền → kiểm tra elapsed
        console.log('[AppState] Ra nền — Kiểm tra lại thời gian phiên');
        const user = auth.currentUser;
        if (user) {
          await startSessionTimer(user.uid); // tái dùng logic kiểm tra elapsed
        }
      }
    });

    return () => subscription.remove();
  }, [startSessionTimer]);

  // ─────────────────────────────────────────────
  // useEffect chính: load config + lắng nghe auth
  // ─────────────────────────────────────────────
  //useEffect([], ...) có nghĩa là: "Chỉ chạy đoạn code này ĐÚNG MỘT LẦN duy nhất khi Component này (ở đây là toàn bộ App) được khởi tạo (Mount) vào bộ nhớ (RAM)".
  useEffect(() => {
    // Đọc config từ Firestore song song, không chờ auth
    const loadConfig = async () => {
      try {
        //lệnh đọc Appconfig từ firebase sẽ chỉ thực hiện 1 lần mỗi khi:
        //1. Reload trang
        //2.Đóng tab/ đóng trình duyệt
        //3.mất điện, máy tính điện thoại sập nguồn
        //4.Tắt hoàn toàn app trên máy (không cho nó chạy ngầm trên máy Mobile)
        //==> suy cho cùng: mất bộ nhớ tạm thời RAM thì hệ thống sẽ buộc phải tìm đến cấu trúc Appconfig trên firebase 
        const configSnap = await getDoc(doc(db, 'SystemSettings', 'AppConfigs'));//đọc Appconfig từ firebase
        if (configSnap.exists()) {
          console.log(' [Config] Đã tải cấu hình: secTimeout =', configSnap.data().secTimeout, 'phút');
          setConfig({ ...DEFAULT_CONFIG, ...configSnap.data(), isLoaded: true });
        } 
        else {
          console.log('[Config] Không tìm thấy SystemSettings, dùng mặc định');
          setConfig({ ...DEFAULT_CONFIG, isLoaded: true });
        }
      } catch (err) {
        console.error('[App] Load config error:', err);
        setConfig({ ...DEFAULT_CONFIG, isLoaded: true });
      }
    };
    loadConfig();

    // Lắng nghe trạng thái đăng nhập
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('[Auth] User đăng nhập:', user.email);
        try {
          //Sửa lỗi Race Condition trong quá trình xác thực xung đột Role khi đăng nhập bằng nền tảng Google/Facebook
          // 1. Đọc role mà người dùng VỪA BẤM TỪ LOGIN
          const pendingRole = await AsyncStorage.getItem('pending_login_role');

          //2. Đọc role thực tế từ firebase
          const { role, fullName } = await getOrCreateUser(
            user.uid, user.displayName, user.email
          );
          // Chuẩn hoá role để so sánh chính xác
          let dbRole = role || 'Học sinh';
          if (dbRole === 'student') dbRole = 'Học sinh';
          if (dbRole === 'teacher') dbRole = 'Giáo viên';
          // 3. KIỂM TRA CHẶN CỬA: Nếu có pendingRole và bị lệch với DB -> Chặn luôn!
          if (pendingRole && dbRole !== 'Admin' && dbRole !== 'admin' && dbRole !== pendingRole) {
              console.log('[App.js] Chặn chuyển trang do xung đột email mà Role khác nhau!');
              await signOut(auth); // Đăng xuất lập tức
              await AsyncStorage.removeItem('pending_login_role'); // Xoá biến tạm
              return; // RETURN NGAY TẠI ĐÂY  - KHÔNG CHẠY XUỐNG LOGIC CHUYỂN TRANG
          }

          // 4. Nếu an toàn đi qua cửa -> Xoá biến tạm và cho phép chuyển trang bình thường
          await AsyncStorage.removeItem('pending_login_role');

          setUserName(fullName);
          setUserRole(role);
          isLoggedInRef.current = true;

          // Gán recordActivity vào ref để App root dùng được
          recordActivityRef.current = recordActivity;

          // Bắt đầu / tiếp tục session timer
          await startSessionTimer(user.uid);

          const checkNav = setInterval(() => {
            if (navigationRef.current?.isReady()) {
              clearInterval(checkNav);
              navigateByRole(navigationRef.current, role);
              setChecking(false);
            }
          }, 100);
          return;
        } catch (err) {
          console.error('[App] Auto-login error:', err);
        }
      }

      // user = null → đã đăng xuất (thủ công hoặc do timer)
      console.log('[Auth] Không có user/Đã đăng xuất');
      isLoggedInRef.current = false;
      clearTimeout(timerRef.current);
      setChecking(false);
    });

    return () => {
      unsubscribe();
      clearTimeout(timerRef.current);
    };
  }, []);

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

// ─────────────────────────────────────────────
// Root App
// ─────────────────────────────────────────────
export default function App() {
  const navigationRef = React.useRef(null);
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  // ── recordActivity được tạo ở đây để truyền xuống View bắt touch ──
  // Dùng ref để AuthHandler có thể ghi vào mà không cần prop drilling
  const recordActivityRef = useRef(null);

  return (
    <ConfigContext.Provider value={config}>
      <UserProvider>
        <NavigationContainer ref={navigationRef}>
          <StatusBar style="auto" />
          <AuthHandler
            navigationRef={navigationRef}
            setConfig={setConfig}
            recordActivityRef={recordActivityRef}
          />
          {/*
            View bắt mọi thao tác chạm trong toàn app.
            onStartShouldSetResponder trả về false → sự kiện vẫn đi xuống bình thường,
            không ảnh hưởng UI hay các button bên dưới.
          */}
          <View
            style={{ flex: 1 }}
            onStartShouldSetResponder={() => {
              recordActivityRef.current?.();
              return false;
            }}
            onMoveShouldSetResponder={() => {
              recordActivityRef.current?.();
              return false;
            }}
          >
            <AppNavigator />
          </View>
        </NavigationContainer>
      </UserProvider>
    </ConfigContext.Provider>
  );
}