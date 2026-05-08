// navigation/AppNavigator.js
import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CommonActions } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
// Import các Screens chính
import Dashboard_Thi_Sinh from "../Screens_Duy/Dashboard_Thi_Sinh";
import Profile_Thi_Sinh from "../Screens_Duy/Profile_Thi_Sinh";
import Man_Hinh_Lam_Bai from "../Screens_Duy/Man_Hinh_Lam_Bai";
import Ket_Qua_Va_Phan_Tich from "../Screens_Duy/Ket_Qua_Va_Phan_Tich";
import Tao_De_Thi_Part1 from "../Screens_Duy/Tao_De_Thi_Part1";
import Tao_De_Thi_Part2 from "../Screens_Duy/Tao_De_Thi_Part2";
import Lich_Su_Lam_Bai from "../Screens_Duy/Lich_Su_Lam_Bai";
import Chi_Tiet_Dap_An from "../Screens_Duy/Chi_Tiet_Dap_An";
import Ket_Qua_Dummy from "../Screens_Duy/Ket_Qua_Dummy";
import AdminChartScreen from "../src/screens/AdminChartScreen";
import AdminConfigScreen from "../src/screens/AdminConfigScreen";
import AdminDashboardScreen from "../src/screens/AdminDashboardScreen";
import LoadingScreen from "../src/screens/LoadingScreen";
import Onboarding1 from "../src/screens/Onboarding1";
import Onboarding2 from "../src/screens/Onboarding2";
import Onboarding3 from "../src/screens/Onboarding3";

// ── Import Auth của thanh niên Duy ──
import Login from "../Screens_Duy/Login";
import Register from "../Screens_Duy/Register";

// ── Placeholder screens cho các role chưa có màn hình riêng ──
const ClassesScreen = () => (
  <View style={styles.placeholder}>
    <Text>Classes Screen</Text>
  </View>
);

// Placeholder tạm cho teacher / admin — thay bằng navigator thật khi có screens
const TeacherAdminPlaceholder = () => (
  <View style={styles.placeholder}>
    <Text style={{ fontSize: 18, fontWeight: "700", color: "#F57C00" }}>
      Khu vực Giáo viên / Admin
    </Text>
    <Text style={{ fontSize: 13, color: "#718096", marginTop: 8 }}>
      (Đang phát triển)
    </Text>
  </View>
);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ── Bottom Tab Navigator — Student ──
function MainTabNavigator() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [styles.tabBar, { bottom: insets.bottom + 1 }],
        tabBarItemStyle: { flex: 1 },
        tabBarIcon: ({ focused }) => {
          let iconName;
          let label;

          if (route.name === "Dashboard") {
            iconName = focused ? "grid" : "grid-outline";
            label = "Dashboard";
          } else if (route.name === "Classes") {
            iconName = focused ? "book" : "book-outline";
            label = "Classes";
          } else if (route.name === "History") {
            iconName = focused ? "stats-chart" : "stats-chart-outline";
            label = "History";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
            label = "Profile";
          }

          return (
            <View style={[styles.tabItem, focused && styles.tabItemActive]}>
              <Ionicons
                name={iconName}
                size={22}
                color={focused ? "#1d4ed8" : "#94a3b8"}
              />
              <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
                {label}
              </Text>
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard_Thi_Sinh} />
      {/* ── Classes: đã có màn hình thật thay vì placeholder ── */}
      <Tab.Screen name="Classes" component={Classes_Thi_Sinh} />
      <Tab.Screen name="History" component={Lich_Su_Lam_Bai} />
      <Tab.Screen name="Profile" component={Profile_Thi_Sinh} />
    </Tab.Navigator>
  );
}

// ── Bottom Tab Navigator — Teacher / Admin ──
function MainTabNavigatorAdmin({ navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [styles.tabBar, { bottom: insets.bottom + 1 }],
        tabBarItemStyle: { flex: 1 },
        tabBarIcon: ({ focused }) => {
          let iconName;
          let label;

          if (route.name === "AdminHome") {
            iconName = focused ? "grid" : "grid-outline";
            label = "Trang chủ";
          } else if (route.name === "AdminClasses") {
            iconName = focused ? "book" : "book-outline";
            label = "Lớp học";
          } else if (route.name === "AdminStats") {
            iconName = focused ? "stats-chart" : "stats-chart-outline";
            label = "Thống kê";
          } else if (route.name === "AdminProfile") {
            iconName = focused ? "person" : "person-outline";
            label = "Hồ sơ";
          }

          return (
            <View style={[styles.tabItem, focused && styles.tabItemActive]}>
              <Ionicons
                name={iconName}
                size={22}
                color={focused ? "#F57C00" : "#94a3b8"}
              />
              <Text
                style={[
                  styles.tabLabel,
                  focused && { color: "#F57C00", fontWeight: "700" },
                ]}
              >
                {label}
              </Text>

              {/* Nút quay về Login - ĐÃ THÊM LOGIC XÓA DỮ LIỆU ĐỂ CHẶN AUTO LOGIN */}
              {route.name === "AdminProfile" && (
                <TouchableOpacity
                  onPress={async () => {
                    try {
                      await AsyncStorage.multiRemove([
                        "atoza_last_active",
                        "atoza_session_uid",
                        "pending_login_role",
                        "userRole",
                        "userName",
                      ]);
                      await signOut(auth);

                      // 3. Reset stack và đưa về Login
                      navigation.dispatch(
                        CommonActions.reset({
                          index: 0,
                          routes: [{ name: "Login" }],
                        })
                      );
                    } catch (error) {
                      console.error('Lỗi đăng xuất:', error);
                    }
                  }}
                  style={{ marginTop: 6 }}
                >
                  <Text style={{ fontSize: 11, color: "#ef4444" }}>
                    Quay về Login
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="AdminHome" component={TeacherAdminPlaceholder} />
      <Tab.Screen name="AdminClasses" component={TeacherAdminPlaceholder} />
      <Tab.Screen name="AdminStats" component={TeacherAdminPlaceholder} />
      <Tab.Screen name="AdminProfile" component={TeacherAdminPlaceholder} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Loading"
      screenOptions={{ headerShown: false }}
    >
      {/* ── Khu vực UI của Kỹ sư Chiến ── */}
      <Stack.Screen name="Loading" component={LoadingScreen} />
      <Stack.Screen name="DashboardAdmin" component={AdminDashboardScreen} />
      <Stack.Screen name="ChartAdmin" component={AdminChartScreen} />
      <Stack.Screen name="ConfigAdmin" component={AdminConfigScreen} />
      <Stack.Screen name="FirstOnboarding" component={Onboarding1} />
      <Stack.Screen name="SecondOnboarding" component={Onboarding2} />
      <Stack.Screen name="ThirdOnboarding" component={Onboarding3} />

      {/* ── Khu vực Auth của thanh niên Duy ── */}
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />

      {/* ── Student area ── */}

      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="Man_Hinh_Lam_Bai" component={Man_Hinh_Lam_Bai} />
      <Stack.Screen
        name="Ket_Qua_Va_Phan_Tich"
        component={Ket_Qua_Va_Phan_Tich}
      />
      <Stack.Screen name="Tao_De_Thi_Part1" component={Tao_De_Thi_Part1} />
      <Stack.Screen name="Tao_De_Thi_Part2" component={Tao_De_Thi_Part2} />
      <Stack.Screen name="Ket_Qua_Dummy" component={Ket_Qua_Dummy} />
      <Stack.Screen name="Chi_Tiet_Dap_An" component={Chi_Tiet_Dap_An} />

      {/* Teacher / Admin */}
      <Stack.Screen name="MainTabsAdmin" component={MainTabNavigatorAdmin} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    minHeight: 85,
    height: 85,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderTopWidth: 0,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    paddingHorizontal: 10,
    position: "absolute",
    bottom: 0,
    left: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: Platform.OS === "ios" ? 20 : 15,
  },
  tabItem: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    width: 85,
    height: 65,
    borderRadius: 18,
    marginTop: Platform.OS === "ios" ? 20 : 0,
  },
  tabItemActive: {
    backgroundColor: "#eff6ff",
    width: 85,
    height: 65,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1d4ed8",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    transform: [{ scale: 1.05 }],
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    color: "#94a3b8",
    fontWeight: "500",
  },
  tabLabelActive: {
    color: "#1d4ed8",
    fontWeight: "700",
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
});
