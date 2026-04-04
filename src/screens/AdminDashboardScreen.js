import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, FileText, Activity, Shield } from 'lucide-react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function AdminDashboardScreen() {
  // Data nên được tách ra ngoài hàm return
  const stats = [
    { id: 1, title: 'Tổng người dùng', value: '1.234', sub: '156 giáo viên, 1078 học sinh', icon: <Users color="#10B981" size={24} /> },
    { id: 2, title: 'Tổng đề thi', value: '856', sub: '48 đang hoạt động', icon: <FileText color="#10B981" size={24} /> },
    { id: 3, title: 'Bài thi hôm nay', value: '342', sub: '128 đang diễn ra', icon: <Activity color="#A855F7" size={24} /> },
    { id: 4, title: 'Hệ thống', value: '99.8%', sub: 'Hoạt động bình thường', icon: <Shield color="#F97316" size={24} /> },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={[styles.header, styles.globalPadding, styles.globalBetween]}>
          <View style={[styles.comeback, styles.globalBetween]}>
            <MaterialIcons name="arrow-back" size={20} color="black" />
            <Text style={styles.boldText}>Quay Lại</Text>
          </View>
          <View style={[styles.hello, styles.globalBetween]}>
            <Text>Xin Chào</Text>
            <Text style={styles.boldText}>Admin System</Text>
          </View>
        </View>

        {/* Body */}
        <View style={[styles.body, styles.globalPadding]}>
          <View>
            <Text style={[styles.boldText, styles.dashBoard]}>Dashboard Quản Trị Viên</Text>
            <Text style={styles.miniDashBoard}>Quản lý và giám sát toàn bộ hệ thống</Text>
          </View>
          
          <View>
            <TouchableOpacity style={styles.buttonStyle}>
              <Text style={styles.button}>⚙️ Cài Đặt Hệ Thống</Text>
            </TouchableOpacity>
          </View>

          {/* Render Stats Cards */}
          {stats.map((item) => (
            <View key={item.id} style={styles.card}>
              {item.icon}
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.value}>{item.value}</Text>
              <Text style={styles.subText}>{item.sub}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// Giữ nguyên đống Styles của em
const styles = StyleSheet.create({
  globalPadding: { paddingHorizontal: 15 },
  globalBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  container: { flex: 1, backgroundColor: '#fff' },
  header: { marginTop: 10 },
  body: { marginTop: 30, backgroundColor: '#E0E0E0', padding: 20 },
  comeback: { gap: 8 },
  hello: { gap: 8 },
  boldText: { fontWeight: 'bold' },
  dashBoard: { fontSize: 24 },
  miniDashBoard: { fontSize: 12 },
  button: { fontSize: 18, color: 'white' },
  buttonStyle: {
    marginTop: 20, alignItems: 'center', backgroundColor: '#007BFF',
    borderRadius: 12, padding: 10, shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.35,
    shadowRadius: 6, elevation: 16,
  },
  card: {
    width: '100%', backgroundColor: '#FFFFFF', padding: 16,
    marginTop: 20, borderRadius: 12, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05,
    shadowRadius: 4, elevation: 2, alignItems: 'center'
  },
  title: { fontSize: 14, color: '#6B7280', marginBottom: 4 },
  value: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  subText: { fontSize: 12, color: '#9CA3AF' }
});