// screens/ClassDashboardScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  SafeAreaView,
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { db } from '../firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function ClassDashboardScreen({ navigation, route }) {
  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const classId = route?.params?.classId;

  useEffect(() => {
    if (!classId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Fetch class data
    const classQuery = query(
      collection(db, 'classes'),
      where('__name__', '==', classId)
    );

    const classUnsubscribe = onSnapshot(classQuery, (snapshot) => {
      if (!snapshot.empty) {
        setClassData({
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data()
        });
      }
    });

    // Fetch students in the class
    const studentsQuery = query(
      collection(db, 'users'),
      where('role', '==', 'Học sinh')
    );

    const studentsUnsubscribe = onSnapshot(studentsQuery, (snapshot) => {
      const studentsData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.fullName || 'Unknown',
          email: data.email || '',
          status: 'Hoạt động',
          avatar: `https://i.pravatar.cc/150?u=${doc.id}`,
          isOnline: Math.random() > 0.3, // Mock online status
        };
      });
      setStudents(studentsData);
      setLoading(false);
    });

    return () => {
      classUnsubscribe();
      studentsUnsubscribe();
    };
  }, [classId]);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <SafeAreaView style={styles.container}>
      {/* Top App Bar */}
      <View style={styles.topAppBar}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#1D4ED8" />
        </TouchableOpacity>
        <Text style={styles.logoText}>Atoza</Text>
        <View style={{ width: 34 }} /> {/* Spacer để cân bằng title ở giữa */}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0050CB" />
        </View>
      ) : !classData ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Class not found</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.screenTitle}>Lớp Học</Text>
            <View style={styles.classBadge}>
              <Ionicons name="bookmark" size={12} color="#0050CB" />
              <Text style={styles.classBadgeText}>{classData?.className || 'Classroom'}</Text>
            </View>
          </View>

          {/* Main Class Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>{classData?.className || 'Classroom'}</Text>
            <View style={styles.infoCardSubtitleBox}>
              <Ionicons name="people" size={16} color="#0050CB" />
              <Text style={styles.infoCardSubtitle}>{students.length} Học sinh đăng ký</Text>
            </View>
            {classData?.level && (
              <Text style={styles.infoCardMeta}>Cấp độ: {classData.level}</Text>
            )}
            {classData?.classCode && (
              <View style={styles.codeDisplayRow}>
                <Text style={styles.codeDisplayLabel}>Mã lớp: </Text>
                <Text style={styles.codeDisplayValue}>{classData.classCode}</Text>
              </View>
            )}
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsSection}>
            <Text style={styles.sectionTitle}>Thao tác nhanh</Text>
            
            <TouchableOpacity activeOpacity={0.8} style={styles.actionBtnWrapper}>
              <LinearGradient
                colors={['#0050CB', '#0066FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryActionBtn}
              >
                <Ionicons name="document-text" size={20} color="#FFFFFF" />
                <Text style={styles.primaryActionText}>Giao bài tập</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryActionBtn} activeOpacity={0.7}>
              <Ionicons name="notifications" size={20} color="#003FA4" />
              <Text style={styles.secondaryActionText}>Gửi thông báo</Text>
            </TouchableOpacity>
          </View>

          {/* Student List Preview */}
          <View style={styles.studentsSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Học sinh ({filteredStudents.length})</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.studentsCard}>
              {/* Search Input */}
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={18} color="#C2C6D8" style={styles.searchIcon} />
                <TextInput 
                  style={styles.searchInput}
                  placeholder="Tìm kiếm học sinh..."
                  placeholderTextColor="#C2C6D8"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              {/* List */}
              {filteredStudents.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>Không tìm thấy học sinh</Text>
                </View>
              ) : (
                <View style={styles.listContainer}>
                  {filteredStudents.map((student) => (
                    <View key={student.id} style={styles.studentRow}>
                      <View style={styles.avatarWrapper}>
                        <Image source={{ uri: student.avatar }} style={styles.avatar} />
                        <View style={[styles.statusDot, { backgroundColor: student.isOnline ? '#10B981' : '#C2C6D8' }]} />
                      </View>
                      <View style={styles.studentInfo}>
                        <Text style={styles.studentName}>{student.name}</Text>
                        <Text style={styles.studentStatus}>{student.status}</Text>
                      </View>
                      <TouchableOpacity style={styles.moreBtn}>
                        <Ionicons name="ellipsis-vertical" size={16} color="#C2C6D8" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Spacer */}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#727687',
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
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(29, 78, 216, 0.1)',
  },
  logoText: {
    fontWeight: '700',
    fontSize: 20,
    color: '#1D4ED8',
    letterSpacing: -0.4,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
  },
  screenTitle: {
    fontWeight: '700',
    fontSize: 44,
    color: '#0B1C30',
    letterSpacing: -2.2,
  },
  classBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF4FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 9999,
    gap: 8,
    marginTop: 8,
  },
  classBadgeText: {
    fontWeight: '500',
    fontSize: 14,
    color: '#0B1C30',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoCardTitle: {
    fontWeight: '700',
    fontSize: 20,
    color: '#0B1C30',
    marginBottom: 8,
  },
  infoCardSubtitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoCardSubtitle: {
    fontWeight: '500',
    fontSize: 16,
    color: '#424656',
  },
  infoCardMeta: {
    fontSize: 12,
    color: '#727687',
    marginBottom: 8,
  },
  codeDisplayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  codeDisplayLabel: {
    fontSize: 12,
    color: '#727687',
    fontWeight: '500',
  },
  codeDisplayValue: {
    fontSize: 12,
    color: '#0050CB',
    fontWeight: '700',
    letterSpacing: 1,
  },
  quickActionsSection: {
    gap: 16,
    marginBottom: 32,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#0B1C30',
  },
  seeAllText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#0050CB',
  },
  actionBtnWrapper: {
    shadowColor: '#0050CB',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  primaryActionBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    borderRadius: 48,
    gap: 8,
  },
  primaryActionText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#FFFFFF',
  },
  secondaryActionBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    backgroundColor: '#DCE9FF',
    borderRadius: 48,
    gap: 8,
  },
  secondaryActionText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#003FA4',
  },
  studentsSection: {
    marginTop: 8,
  },
  studentsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF4FF',
    borderRadius: 9999,
    paddingHorizontal: 16,
    height: 44,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0B1C30',
  },
  listContainer: {
    gap: 20,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#727687',
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  studentInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  studentName: {
    fontWeight: '700',
    fontSize: 14,
    color: '#0B1C30',
    marginBottom: 2,
  },
  studentStatus: {
    fontWeight: '500',
    fontSize: 10,
    color: '#424656',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  moreBtn: {
    padding: 8,
  },
});