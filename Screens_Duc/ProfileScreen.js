// screens/ProfileScreen.js
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
  // Cấu trúc mảng menu giúp code gọn gàng (DRY)
  const menuItems = [
    { id: 'profile', title: 'Hồ sơ cá nhân', icon: 'person', color: '#2563EB', bg: '#EFF6FF' },
    { id: 'password', title: 'Đổi mật khẩu', icon: 'lock-closed', color: '#2563EB', bg: '#EFF6FF' },
    { id: 'notifications', title: 'Thông báo', icon: 'notifications', color: '#2563EB', bg: '#EFF6FF' },
    { id: 'support', title: 'Hỗ trợ', icon: 'help-buoy', color: '#2563EB', bg: '#EFF6FF' },
    { 
      id: 'logout', 
      title: 'Đăng xuất', 
      icon: 'log-out', 
      color: '#BA1A1A', 
      bg: 'rgba(255, 218, 214, 0.3)', 
      isDestructive: true 
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Top App Bar */}
      <View style={styles.topAppBar}>
        <Text style={styles.logoText}>Atoza</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="settings-outline" size={20} color="#1D4ED8" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/300?u=teacher' }} 
              style={styles.avatar} 
            />
            {/* Badge Edit/Camera */}
            <TouchableOpacity style={styles.avatarBadge} activeOpacity={0.8}>
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.userName}>Nguyễn Đình Duy</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>GIÁO VIÊN</Text>
            </View>
          </View>
        </View>

        {/* Settings List */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>CÀI ĐẶT TÀI KHOẢN</Text>

          <View style={styles.menuList}>
            {menuItems.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={[
                  styles.menuItem, 
                  item.isDestructive && styles.menuItemDestructive
                ]}
                activeOpacity={0.7}
                onPress={() => {
                  if (item.id === 'logout') {
                    // Xử lý logic đăng xuất tại đây (clear token, navigate to Auth stack...)
                    alert('Đăng xuất thành công!');
                  }
                }}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.iconWrapper, { backgroundColor: item.bg }]}>
                    <Ionicons name={item.icon} size={20} color={item.color} />
                  </View>
                  <Text style={[styles.menuItemTitle, { color: item.color }]}>
                    {item.title}
                  </Text>
                </View>
                
                {/* Chỉ hiện mũi tên nếu không phải nút đăng xuất */}
                {!item.isDestructive && (
                  <Ionicons name="chevron-forward" size={16} color="#C2C6D8" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Spacer cho Bottom Tab */}
        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  topAppBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 10,
  },
  logoText: {
    fontWeight: '700',
    fontSize: 24,
    color: '#1D4ED8',
    letterSpacing: -1.2,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#D3E4FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  heroSection: {
    alignItems: 'center',
    gap: 24,
    marginBottom: 40,
  },
  avatarContainer: {
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  avatarBadge: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 36,
    height: 36,
    backgroundColor: '#0050CB',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  infoContainer: {
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontWeight: '700',
    fontSize: 22,
    color: '#0B1C30',
    letterSpacing: -0.4,
  },
  roleBadge: {
    backgroundColor: '#DAE1FF',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 9999,
  },
  roleText: {
    fontWeight: '700',
    fontSize: 14,
    color: '#001849',
    letterSpacing: 0.8,
  },
  settingsSection: {
    gap: 24,
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: '#727687',
    letterSpacing: 1.6,
    marginLeft: 8,
  },
  menuList: {
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  menuItemDestructive: {
    borderWidth: 1,
    borderColor: 'rgba(186, 26, 26, 0.2)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontWeight: '600',
    fontSize: 16,
  },
});