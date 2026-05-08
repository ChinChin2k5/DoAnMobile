// Screens_Duy/Profile_Thi_Sinh.js
import React, { useState, useEffect, useRef, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Image, Animated, Alert,Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../firebaseConfig'; 
import { signOut } from 'firebase/auth';

const SkeletonItem = ({ width, height, borderRadius = 4, style }) => {
  const opacity = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.8, duration: 500, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, [opacity]);
  return (
    <Animated.View style={[{ width, height, borderRadius, backgroundColor: '#cbd5e1', opacity }, style]} />
  );
};

export default function Profile_Thi_Sinh({ navigation }) {
  const { userName, setUserName, setUserRole } = useContext(UserContext) || {};
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 750);
    return () => clearTimeout(timer);
  }, []);

  // HÀM XỬ LÝ ĐĂNG XUẤT THẬT SỰ
  const handleSignOut = async () => {
    try {
      await signOut(auth); // Thoát khỏi Firebase
      if (setUserName) setUserName('Người dùng'); // Xóa data trong Context
      if (setUserRole) setUserRole('');
      navigation.replace('Login'); // Về màn hình Login
    } catch (error) {
      Alert.alert("Lỗi", "Không thể đăng xuất lúc này.");
    }
  };

  const settingsOptions = [
    { id: '1', title: 'Hồ sơ cá nhân', icon: 'person', iconColor: '#3b82f6' },
    { id: '2', title: 'Kết quả học tập', icon: 'clipboard', iconColor: '#3b82f6' },
    { id: '3', title: 'Thông báo', icon: 'notifications', iconColor: '#3b82f6' },
    { id: '4', title: 'Liên hệ hỗ trợ', icon: 'headset', iconColor: '#3b82f6' },
    { id: '5', title: 'Đăng xuất', icon: 'log-out-outline', iconColor: '#ef4444', isLogout: true },
  ];

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <SkeletonItem width={30} height={30} borderRadius={15} />
          <SkeletonItem width={180} height={20} />
          <SkeletonItem width={30} height={30} borderRadius={15} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.profileSection}>
            <SkeletonItem width={100} height={100} borderRadius={50} style={{ marginBottom: 15 }} />
            <SkeletonItem width={150} height={24} style={{ marginBottom: 10 }} />
          </View>
          <View style={styles.settingsSection}>
            {[1, 2, 3, 4, 5].map((i) => (
              <View key={i} style={styles.settingItem}><SkeletonItem width="100%" height={20} /></View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hồ sơ Cá nhân</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png' }} style={styles.avatar} />
          </View>
          <Text style={styles.userName}>{userName || 'Người dùng'}</Text>
          <View style={styles.roleBadge}><Text style={styles.roleText}>HỌC SINH</Text></View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>CÀI ĐẶT TÀI KHOẢN</Text>
          {settingsOptions.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.settingItem}
              onPress={() => item.isLogout ? handleSignOut() : null}
            >
              <View style={styles.settingItemLeft}>
                <View style={styles.settingIconWrapper}>
                  <Ionicons name={item.icon} size={20} color={item.iconColor} />
                </View>
                <Text style={[styles.settingItemTitle, item.isLogout && { color: '#ef4444' }]}>
                  {item.title}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingTop: Platform.OS === 'android' ? 60 : 60, paddingBottom:60, },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 15 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  profileSection: { alignItems: 'center', marginTop: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#e2e8f0' },
  userName: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginVertical: 8 },
  roleBadge: { backgroundColor: '#bfdbfe', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  roleText: { fontSize: 12, fontWeight: 'bold', color: '#1e3a8a' },
  settingsSection: { marginTop: 30 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#64748b', marginBottom: 15 },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', padding: 16, borderRadius: 16, marginBottom: 12 },
  settingItemLeft: { flexDirection: 'row', alignItems: 'center' },
  settingIconWrapper: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  settingItemTitle: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
});