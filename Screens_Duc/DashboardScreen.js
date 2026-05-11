// screens/DashboardScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { db, auth } from '../firebaseConfig';
import { collection, query, onSnapshot, where } from 'firebase/firestore';

export default function DashboardScreen({ navigation }) {
  const [userRole, setUserRole] = useState(null);
  const [totalStudents, setTotalStudents] = useState(0);
  const [examsCreated, setExamsCreated] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch data from Firestore for teacher user
  useEffect(() => {
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Query current user to verify teacher role
    const userQuery = query(collection(db, 'users'), where('uid', '==', currentUser.uid));

    const userUnsubscribe = onSnapshot(userQuery, (snapshot) => {
      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        setUserRole(userData.role);

        // Only proceed if user is a teacher
        if (userData.role === 'Giáo viên') {
          // Query exams created by this teacher
          const examsQuery = query(
            collection(db, 'exams'),
            where('createdBy', '==', currentUser.uid)
          );

          const examsUnsubscribe = onSnapshot(examsQuery, (snapshot) => {
            setExamsCreated(snapshot.docs.length);
          });

          // Query all students (role = 'Học sinh')
          const studentsQuery = query(
            collection(db, 'users'),
            where('role', '==', 'Học sinh')
          );

          const studentsUnsubscribe = onSnapshot(studentsQuery, (snapshot) => {
            setTotalStudents(snapshot.docs.length);
            setLoading(false);
          });

          return () => {
            examsUnsubscribe();
            studentsUnsubscribe();
          };
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => {
      userUnsubscribe();
    };
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header - TopAppBar placeholder */}
        <View style={styles.topAppBar}>
            <Text style={styles.logoText}>Atoza</Text>
            {/* Thêm các icon nút bấm góc phải tại đây */}
        </View>

        {/* Welcome Header */}
        <View style={styles.welcomeSection}>
          <Text style={styles.greetingText}>{getGreeting()}, Giáo viên.</Text>
          
          <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('CreateExamStep1')}>
            <LinearGradient
              colors={['#0050CB', '#0066FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.createButton}
            >
              <Text style={styles.createButtonText}>+ Tạo đề thi mới</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBg, { backgroundColor: '#DAE1FF' }]} />
            </View>
            <View>
              <Text style={styles.cardLabel}>TỔNG SỐ HỌC SINH</Text>
              <Text style={styles.cardNumber}>{loading ? '-' : totalStudents.toLocaleString('vi-VN')}</Text>
            </View>
          </View>

          <View style={[styles.card, { marginTop: 16 }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBg, { backgroundColor: '#CFE5FF' }]} />
            </View>
            <View>
              <Text style={styles.cardLabel}>BÀI THI ĐÃ TẠO</Text>
              <Text style={styles.cardNumber}>{loading ? '-' : examsCreated}</Text>
            </View>
          </View>
        </View>

        {/* Charts & Activity Section */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Hoạt động trong ngày</Text>
          
          {!loading && examsCreated > 0 ? (
            <View style={styles.activityItem}>
              <View style={styles.activityTime}>
                <Text style={styles.timeTextPrimary}>{new Date().getHours().toString().padStart(2, '0')}:{new Date().getMinutes().toString().padStart(2, '0')}</Text>
                <Text style={styles.timeTextSecondary}>HÔM NAY</Text>
              </View>
              <View style={styles.verticalDivider} />
              <View style={styles.activityDetail}>
                <Text style={styles.activityTitle}>Quản lý đề thi</Text>
                <Text style={styles.activitySub}>Đã tạo {examsCreated} bài thi</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.emptyActivityText}>Chưa có hoạt động nào hôm nay</Text>
          )}
        </View>

        {/* Spacer cho Bottom Tab */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  topAppBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  logoText: {
    fontWeight: '700',
    fontSize: 24,
    color: '#1D4ED8',
    letterSpacing: -1.2,
  },
  welcomeSection: {
    gap: 24,
    marginBottom: 40,
  },
  greetingText: {
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: 44,
    lineHeight: 55,
    letterSpacing: -1.1,
    color: '#0B1C30',
  },
  createButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  createButtonText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#FFFFFF',
  },
  summaryContainer: {
    marginBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 32,
    height: 180,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconBg: {
    width: 46,
    height: 40,
    borderRadius: 16,
  },
  cardLabel: {
    fontWeight: '500',
    fontSize: 14,
    color: '#424656',
    letterSpacing: 0.35,
    marginBottom: 4,
  },
  cardNumber: {
    fontWeight: '700',
    fontSize: 36,
    color: '#0B1C30',
  },
  activitySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 20,
    color: '#0B1C30',
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF4FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  activityTime: {
    alignItems: 'center',
    width: 60,
  },
  timeTextPrimary: {
    fontWeight: '700',
    fontSize: 14,
    color: '#0050CB',
  },
  timeTextSecondary: {
    fontWeight: '700',
    fontSize: 10,
    color: '#424656',
  },
  verticalDivider: {
    width: 2,
    height: 40,
    backgroundColor: 'rgba(0, 80, 203, 0.2)',
    marginHorizontal: 16,
  },
  activityDetail: {
    flex: 1,
  },
  activityTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: '#0B1C30',
  },
  activitySub: {
    fontSize: 12,
    color: '#424656',
  },
  emptyActivityText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    paddingVertical: 20,
  },
});