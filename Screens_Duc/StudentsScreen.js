import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const suggestedStudents = [
  {
    id: '1',
    name: 'Julian Vance',
    email: 'julian.v@example.com',
    avatar: 'https://i.pravatar.cc/150?u=4492',
    isActive: true,
  },
  {
    id: '2',
    name: 'Elena Moretti',
    email: 'elena.m@example.com',
    avatar: 'https://i.pravatar.cc/150?u=5103',
    isActive: false,
  },
  {
    id: '3',
    name: 'Amara Okafor',
    email: 'amara.o@example.com',
    avatar: 'https://i.pravatar.cc/150?u=6220',
    isActive: false,
  }
];

export default function StudentsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Top App Bar */}
      <View style={styles.topAppBar}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="menu" size={20} color="#1D4ED8" />
        </TouchableOpacity>
        <Text style={styles.logoText}>Atoza</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="person-outline" size={20} color="#1D4ED8" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Editorial Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.screenTitle}>Create Your Classroom</Text>
          <Text style={styles.screenDesc}>
            Select and invite scholars to the new cognitive journey.
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#727687" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search name or email..."
            placeholderTextColor="rgba(114, 118, 135, 0.6)"
          />
        </View>

        {/* Create Classroom Action Card (Thay thế Bulk Invite) */}
        <View style={styles.createClassCard}>
          <Ionicons name="school" size={140} color="#0B1C30" style={styles.cardWatermark} />
          
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Tạo lớp học mới</Text>
            <Text style={styles.cardDesc}>Thiết lập không gian học tập số cho học sinh của bạn.</Text>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('CreateClass1')}
            >
              <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Tạo lớp ngay</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Suggested Students List */}
        <View style={styles.suggestedSection}>
          <View style={styles.suggestedHeader}>
            <Text style={styles.suggestedTitle}>SUGGESTED STUDENTS</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>SEE ALL</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listContainer}>
            {suggestedStudents.map((student) => (
              <View key={student.id} style={styles.studentCard}>
                <View style={styles.cardLeft}>
                  <View style={styles.avatarWrapper}>
                    <Image source={{ uri: student.avatar }} style={styles.avatar} />
                    {student.isActive && <View style={styles.activeDot} />}
                  </View>
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{student.name}</Text>
                    <Text style={styles.studentEmail}>{student.email}</Text>
                  </View>
                </View>

                {/* Nút Add Student Gradient */}
                <TouchableOpacity activeOpacity={0.8}>
                  <LinearGradient
                    colors={['#0050CB', '#0066FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.addButton}
                  >
                    <Ionicons name="add" size={16} color="#FFFFFF" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Spacer cho Bottom Tab & FAB */}
        <View style={{ height: 160 }} />
      </ScrollView>

      {/* Floating Action Button (Vẫn giữ lại làm nút truy cập nhanh) */}
      <TouchableOpacity 
        style={styles.fabContainer} 
        activeOpacity={0.8}
        onPress={() => navigation.navigate('CreateClass1')}
      >
        <LinearGradient
          colors={['#0050CB', '#0066FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
          <Text style={styles.fabText}>Tạo lớp học</Text>
        </LinearGradient>
      </TouchableOpacity>
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
    fontSize: 20,
    color: '#1D4ED8',
    letterSpacing: -0.4,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(29, 78, 216, 0.1)'
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  headerSection: {
    marginBottom: 24,
    gap: 8,
  },
  screenTitle: {
    fontWeight: '800',
    fontSize: 44,
    lineHeight: 55,
    color: '#0B1C30',
    letterSpacing: -2.2,
  },
  screenDesc: {
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 26,
    color: '#424656',
    opacity: 0.8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF4FF',
    borderRadius: 32,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0B1C30',
  },
  createClassCard: {
    backgroundColor: '#D3E4FE',
    borderRadius: 32,
    padding: 24,
    height: 152,
    justifyContent: 'center',
    marginBottom: 32,
    overflow: 'hidden',
    position: 'relative',
  },
  cardWatermark: {
    position: 'absolute',
    right: -20,
    bottom: -30,
    opacity: 0.05,
  },
  cardContent: {
    gap: 8,
    zIndex: 1,
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#00375D',
  },
  cardDesc: {
    fontSize: 14,
    color: 'rgba(0, 55, 93, 0.7)',
    marginBottom: 4,
    maxWidth: '80%', // Tránh text đè lên icon watermark quá nhiều
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00629E',
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 9999,
    gap: 8,
  },
  actionButtonText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#FFFFFF',
  },
  suggestedSection: {
    gap: 16,
  },
  suggestedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  suggestedTitle: {
    fontWeight: '700',
    fontSize: 12,
    color: '#0B1C30',
    opacity: 0.6,
    letterSpacing: 0.3,
  },
  seeAllText: {
    fontWeight: '600',
    fontSize: 12,
    color: '#0050CB',
  },
  listContainer: {
    gap: 16,
  },
  studentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  activeDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    backgroundColor: '#4345D1',
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  studentInfo: {
    justifyContent: 'center',
  },
  studentName: {
    fontWeight: '700',
    fontSize: 16,
    color: '#0B1C30',
    letterSpacing: -0.4,
    marginBottom: 2,
  },
  studentEmail: {
    fontSize: 12,
    color: '#424656',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 4,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 110,
    right: 24,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  fabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 9999,
    gap: 8,
  },
  fabText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#FFFFFF',
  }
});