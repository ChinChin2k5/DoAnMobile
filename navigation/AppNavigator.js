import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CommonActions } from '@react-navigation/native';

// ── THÊM 3 IMPORT NÀY ĐỂ XỬ LÝ ĐĂNG XUẤT VÀ XÓA DỮ LIỆU ──
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

// ── Import các Screens UI Thống kê / Onboarding (Chiến) ──
import AdminChartScreen from '../src/screens/AdminChartScreen';
import AdminConfigScreen from '../src/screens/AdminConfigScreen';
import AdminDashboardScreen from '../src/screens/AdminDashboardScreen';
import LoadingScreen from '../src/screens/LoadingScreen';
import Onboarding1 from '../src/screens/Onboarding1';
import Onboarding2 from '../src/screens/Onboarding2';
import Onboarding3 from '../src/screens/Onboarding3';

// ── Placeholder screens cho các role chưa có màn hình riêng ──
const ClassesScreen = () => (
  <View style={styles.placeholder}><Text>Classes Screen</Text></View>
);

// Component rỗng để gán tạm cho tab Exams - chỉ dùng listeners để redirect
const EmptyScreen = () => <View />;

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ── Bottom Tab Navigator dành cho 'student' ──
function MainTabNavigator() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBar,
          { bottom: insets.bottom + 1 },
        ],
        tabBarItemStyle: { flex: 1 },
        tabBarIcon: ({ focused }) => {
          let iconName;
          let label;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
            label = 'Dashboard';
          } else if (route.name === 'Classes') {
            iconName = focused ? 'book' : 'book-outline';
            label = 'Classes';
          } else if (route.name === 'History') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
            label = 'History';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
            label = 'Profile';
          }

          return (
            <View style={[styles.tabItem, focused && styles.tabItemActive]}>
              <Ionicons
                name={iconName}
                size={22}
                color={focused ? '#1d4ed8' : '#94a3b8'}
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
      <Tab.Screen name="Classes" component={ClassesScreen} />
      <Tab.Screen name="History" component={Lich_Su_Lam_Bai} />
      <Tab.Screen name="Profile" component={Profile_Thi_Sinh} />
    </Tab.Navigator>
  );
}

// ── Bottom Tab Navigator dành cho 'teacher' / 'admin' ──
function MainTabNavigatorAdmin({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: [
          styles.tabBarAdmin,
          { bottom: insets.bottom + 1 },
        ],
        tabBarItemStyle: { flex: 1 },
        tabBarActiveTintColor: '#F57C00',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          let label;

          if (route.name === 'AdminHome') {
            iconName = focused ? 'home' : 'home-outline';
            label = 'Trang chủ';
          } else if (route.name === 'AdminStudents') {
            iconName = focused ? 'people' : 'people-outline';
            label = 'Học sinh';
          } else if (route.name === 'AdminExams') {
            iconName = focused ? 'document-text' : 'document-text-outline';
            label = 'Đề thi';
          } else if (route.name === 'AdminProfile') {
            iconName = focused ? 'person' : 'person-outline';
            label = 'Hồ sơ';
          }

          return (
            <View style={[styles.tabItem, focused && styles.tabItemActiveAdmin]}>
              <Ionicons name={iconName} size={22} color={color} />
              <Text style={[styles.tabLabel, focused && styles.tabLabelActiveAdmin]}>
                {label}
              </Text>
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="AdminHome" component={DashboardScreen} />
      <Tab.Screen name="AdminStudents" component={StudentsScreen} />
      
      {/* Tab "Exams" sử dụng listeners để redirect tới CreateExamStep1 */}
      <Tab.Screen 
        name="AdminExams" 
        component={EmptyScreen}
        listeners={({ navigation: tabNavigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            tabNavigation.navigate('CreateExamStep1');
          },
        })}
      />
      
      <Tab.Screen name="AdminProfile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login" //màn hình đầu tiên hiển thị khi chạy dự án là screen này
      screenOptions={{ headerShown: false }}
    >
      {/* ── Auth ── */}
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />

      {/* ── Student area ── */}
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="Man_Hinh_Lam_Bai" component={Man_Hinh_Lam_Bai} />
      <Stack.Screen name="Ket_Qua_Va_Phan_Tich" component={Ket_Qua_Va_Phan_Tich} />
      <Stack.Screen name="Tao_De_Thi_Part1" component={Tao_De_Thi_Part1} />
      <Stack.Screen name="Tao_De_Thi_Part2" component={Tao_De_Thi_Part2} />
      <Stack.Screen name="Ket_Qua_Dummy" component={Ket_Qua_Dummy} />
      <Stack.Screen name="Chi_Tiet_Dap_An" component={Chi_Tiet_Dap_An} />

      {/* ── Teacher / Admin area ── */}
      {/* Login & Register đều navigate sang 'MainTabsAdmin' cho role teacher/admin */}
      <Stack.Screen name="MainTabsAdmin" component={MainTabNavigatorAdmin} />
      
      {/* ── Exam Creation Flow (outside Tab Navigator) ── */}
      <Stack.Screen name="CreateExamStep1" component={CreateExamStep1Screen} />
      <Stack.Screen name="CreateExamStep2" component={CreateExamStep2Screen} />
      <Stack.Screen name="CreateExamStep3" component={CreateExamStep3Screen} />

      {/* ── Class Creation Flow (outside Tab Navigator) ── */}
      <Stack.Screen name="CreateClass1" component={CreateClass1Screen} />
      <Stack.Screen name="CreateClass2" component={CreateClass2Screen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    minHeight: 85,
    height: 85,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderTopWidth: 0,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    paddingHorizontal: 10,
    position: 'absolute',
    bottom: 0,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 20 : 15,
  },
  tabBarAdmin: {
    minHeight: 85,
    height: 85,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderTopWidth: 0,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    paddingHorizontal: 10,
    position: 'absolute',
    bottom: 0,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 20 : 15,
  },
  tabItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    width: 85,
    height: 65,
    borderRadius: 18,
    marginTop: Platform.OS === 'ios' ? 20 : 0,
  },
  tabItemActive: {
    backgroundColor: '#eff6ff',
    width: 85,
    height: 65,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1d4ed8',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    transform: [{ scale: 1.05 }],
  },
  tabItemActiveAdmin: {
    backgroundColor: '#fff3e0',
    width: 85,
    height: 65,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F57C00',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    transform: [{ scale: 1.05 }],
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    color: '#94a3b8',
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#1d4ed8',
    fontWeight: '700',
  },
  tabLabelActiveAdmin: {
    color: '#F57C00',
    fontWeight: '700',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
});