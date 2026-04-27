import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import các Screens chính
import Dashboard_Thi_Sinh from '../Screens_Duy/Dashboard_Thi_Sinh';
import Profile_Thi_Sinh from '../Screens_Duy/Profile_Thi_Sinh';
import Man_Hinh_Lam_Bai from '../Screens_Duy/Man_Hinh_Lam_Bai';
import Ket_Qua_Va_Phan_Tich from '../Screens_Duy/Ket_Qua_Va_Phan_Tich';
import Tao_De_Thi_Part1 from '../Screens_Duy/Tao_De_Thi_Part1';
import Tao_De_Thi_Part2 from '../Screens_Duy/Tao_De_Thi_Part2';
import Lich_Su_Lam_Bai from '../Screens_Duy/Lich_Su_Lam_Bai';
import Chi_Tiet_Dap_An from '../Screens_Duy/Chi_Tiet_Dap_An';
import Ket_Qua_Dummy from '../Screens_Duy/Ket_Qua_Dummy';
import Login from '../Screens_Duy/Login';
import Register from '../Screens_Duy/Register';

const ClassesScreen = () => (
  <View style={styles.placeholder}><Text>Classes Screen</Text></View>
);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom tabnavigator dành cho người dùng 'thí sinh'
function MainTabNavigator() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false, 
        tabBarStyle: [
          styles.tabBar,
          {
            bottom: insets.bottom + 1,
          }
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

export default function AppNavigator() {
  return (
    /* Cấu trúc ĐÚNG: Chỉ có 1 Stack.Navigator bao ngoài, các con đều là Stack.Screen */
    <Stack.Navigator 
      initialRouteName="Login" // Thiết lập Login chạy đầu tiên ở đây
      screenOptions={{ headerShown: false }}
    >
      {/*  Màn hình Đăng nhập */}
      <Stack.Screen name="Login" component={Login} />
      {/*Màn hình Đăng ký*/}
      <Stack.Screen name="Register" component={Register}/>

      {/*  Các cụm chức năng chính */}
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="Man_Hinh_Lam_Bai" component={Man_Hinh_Lam_Bai} />
      <Stack.Screen name="Ket_Qua_Va_Phan_Tich" component={Ket_Qua_Va_Phan_Tich} />
      
      {/* 3. Màn hình tạo đề thi */}
      <Stack.Screen name="Tao_De_Thi_Part1" component={Tao_De_Thi_Part1}/>
      <Stack.Screen name="Tao_De_Thi_Part2" component={Tao_De_Thi_Part2}/>
      
      {/* 4. Các màn hình kết quả & chi tiết */}
      <Stack.Screen name="Ket_Qua_Dummy" component={Ket_Qua_Dummy}/>
      <Stack.Screen name="Chi_Tiet_Dap_An" component={Chi_Tiet_Dap_An}/>
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
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc'
  }
});