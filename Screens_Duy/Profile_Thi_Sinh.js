// Screens_Duy/Profile_Thi_Sinh.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, ScrollView, 
  TouchableOpacity, Image, Animated 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Mẹo để áp dụng cho các Screen khác:
// Sau này, khi bạn làm Man_Hinh_Lam_Bai.js hay Ket_Qua.js, chúng ta chỉ cần làm theo 3 bước:

// 1. Copy component SkeletonItem lên đầu file.

// 2. Đặt const [isLoading, setIsLoading] = useState(true); và đoạn useEffect chứa setTimeout 750ms vào đầu Component chính.

// 3. Thêm một khối if (isLoading) { return <Khung_Xương_Của_Bạn_Ở_Đây/> } là xong!
// ==========================================
// 1. CỤM SKELETON DÙNG CHUNG (Tái sử dụng cho mọi Screen)
// ==========================================
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

// ==========================================
// 2. COMPONENT CHÍNH
// ==========================================
export default function Profile_Thi_Sinh({ navigation }) {
  // Cụm Logic Load dữ liệu 0.75s dùng chung
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cài đặt độ trễ 0.75s (750ms) khi mới vào Screen
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 750);
    return () => clearTimeout(timer); // Xóa timer nếu người dùng thoát trang sớm
  }, []);

  const settingsOptions = [
    { id: '1', title: 'Hồ sơ cá nhân', icon: 'person', iconColor: '#3b82f6' },
    { id: '2', title: 'Kết quả học tập', icon: 'clipboard', iconColor: '#3b82f6' },
    { id: '3', title: 'Thông báo', icon: 'notifications', iconColor: '#3b82f6' },
    { id: '4', title: 'Liên hệ hỗ trợ', icon: 'headset', iconColor: '#3b82f6' },
    { id: '5', title: 'Đăng xuất', icon: 'log-out-outline', iconColor: '#ef4444', isLogout: true },
  ];

  // ==========================================
  // RENDER SKELETON KHI ĐANG TẢI (TRONG 0.75S)
  // ==========================================
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <SkeletonItem width={30} height={30} borderRadius={15} />
          <SkeletonItem width={180} height={20} />
          <SkeletonItem width={30} height={30} borderRadius={15} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Skeleton Profile Info */}
          <View style={styles.profileSection}>
            <SkeletonItem width={100} height={100} borderRadius={50} style={{ marginBottom: 15 }} />
            <SkeletonItem width={150} height={24} style={{ marginBottom: 10 }} />
            <SkeletonItem width={100} height={28} borderRadius={14} style={{ marginBottom: 15 }} />
            <SkeletonItem width="80%" height={16} style={{ marginBottom: 6 }} />
            <SkeletonItem width="60%" height={16} />
          </View>

          {/* Skeleton Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              <SkeletonItem width="48%" height={100} borderRadius={16} />
              <SkeletonItem width="48%" height={100} borderRadius={16} />
            </View>
            <SkeletonItem width="100%" height={100} borderRadius={16} style={{ marginTop: 15 }} />
          </View>

          {/* Skeleton Settings */}
          <View style={styles.settingsSection}>
            <SkeletonItem width={150} height={16} style={{ marginBottom: 15, marginLeft: 5 }} />
            {[1, 2, 3, 4, 5].map((item) => (
              <View key={item} style={styles.settingItem}>
                <View style={styles.settingItemLeft}>
                  <SkeletonItem width={36} height={36} borderRadius={18} style={{ marginRight: 15 }} />
                  <SkeletonItem width={120} height={18} />
                </View>
                <SkeletonItem width={20} height={20} borderRadius={10} />
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ==========================================
  // RENDER DỮ LIỆU THẬT SAU KHI HẾT 0.75S
  // ==========================================
  return (
    <SafeAreaView style={styles.container}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hồ sơ Cá nhân Học sinh</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="search" size={24} color="#1e293b" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* --- PROFILE INFO --- */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png' }}
              style={styles.avatar}
            />
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={20} color="white" />
            </View>
          </View>
          
          <Text style={styles.userName}>Nguyễn Văn A</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>HỌC SINH</Text>
          </View>
          <Text style={styles.bioText}>
            Mục tiêu học tập: Nâng cao kiến thức và kỹ năng toàn diện, đạt kết quả cao trong các kỳ thi.
          </Text>
        </View>

        {/* --- STATS SECTION --- */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.statLabel}>ĐIỂM TB</Text>
              <Text style={styles.statValue}>8.5</Text>
            </View>
            <View style={[styles.statCard, { flex: 1, marginLeft: 10 }]}>
              <Text style={styles.statLabel}>KHÓA HỌC</Text>
              <Text style={styles.statValue}>12</Text>
            </View>
          </View>
          <View style={[styles.statCard, { width: '100%', marginTop: 15 }]}>
            <Text style={styles.statLabel}>HOÀN THÀNH</Text>
            <Text style={styles.statValue}>95%</Text>
          </View>
        </View>

        {/* --- SETTINGS SECTION --- */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>CÀI ĐẶT TÀI KHOẢN</Text>
          
          {settingsOptions.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.settingItem}
              onPress={() => {
                if (item.isLogout) console.log("Đăng xuất");
              }}
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

// --- STYLES ---
const styles = StyleSheet.create({
  container: { paddingTop: 30, paddingBottom: 50, flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 15, backgroundColor: '#f8fafc' },
  iconBtn: { padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  
  profileSection: { alignItems: 'center', marginTop: 20 },
  avatarContainer: { position: 'relative', marginBottom: 15 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#e2e8f0' },
  verifiedBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#3b82f6', borderRadius: 12, borderWidth: 2, borderColor: '#f8fafc', width: 26, height: 26, justifyContent: 'center', alignItems: 'center' },
  userName: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 },
  roleBadge: { backgroundColor: '#bfdbfe', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 15 },
  roleText: { fontSize: 12, fontWeight: 'bold', color: '#1e3a8a' },
  bioText: { textAlign: 'center', color: '#475569', fontSize: 14, lineHeight: 22, paddingHorizontal: 10 },

  statsContainer: { marginTop: 30 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statCard: { backgroundColor: '#dbeafe', padding: 20, borderRadius: 16, alignItems: 'flex-start' },
  statLabel: { fontSize: 12, fontWeight: '700', color: '#475569', marginBottom: 8 },
  statValue: { fontSize: 28, fontWeight: 'bold', color: '#1e3a8a' },

  settingsSection: { marginTop: 30 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#64748b', marginBottom: 15, marginLeft: 5 },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', padding: 16, borderRadius: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 2 },
  settingItemLeft: { flexDirection: 'row', alignItems: 'center' },
  settingIconWrapper: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  settingItemTitle: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
});
