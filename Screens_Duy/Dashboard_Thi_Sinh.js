// Screens_Duy/Dashboard_Thi_Sinh.js
import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { UserContext } from '../context/UserContext';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, SafeAreaView, Animated, Modal, ScrollView, RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebaseConfig';
import { collection, query, onSnapshot, orderBy, where } from 'firebase/firestore';

// ==========================================
// 1. COMPONENT SKELETON (HIỆU ỨNG CHỜ TẢI)
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
  return <Animated.View style={[{ width, height, borderRadius, backgroundColor: '#cbd5e1', opacity }, style]} />;
};

const renderSkeletonExamCard = (key) => (
  <View key={key} style={styles.examCard}>
    <SkeletonItem width="70%" height={20} style={{ marginBottom: 10 }} />
    <SkeletonItem width="40%" height={14} style={{ marginBottom: 15 }} />
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <SkeletonItem width={80} height={30} borderRadius={20} />
      <SkeletonItem width={100} height={30} borderRadius={8} />
    </View>
  </View>
);

export default function Dashboard_Thi_Sinh({ navigation }) {
  // SỬA TẠI ĐÂY: Lấy context an toàn, nếu không có classCode thì gán bằng null
  const userContext = useContext(UserContext) || {};
  const userName = userContext.userName;
  const classCode = userContext.classCode || null;

  // --- STATE ---
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tất cả');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  // --- PHÂN TRANG ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ==========================================
  // 2. LẤY DỮ LIỆU TỪ FIREBASE (LỌC THEO USER)
  // ==========================================
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 5000);

    if (!userName) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const q = query(
      collection(db, 'exams'),
      where('status', '==', 'active')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const examList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // SỬA TẠI ĐÂY: Chỉ so sánh classCode khi classCode thực sự tồn tại
      const filteredExams = examList.filter(ex =>
        ex.creatorName === userName || (classCode && ex.targetClass === classCode)
      );

      setExams(filteredExams);
      setLoading(false);
      clearTimeout(timeout);
    }, (error) => {
      console.error("Lỗi Firestore:", error);
      setLoading(false);
      clearTimeout(timeout);
    });

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, [userName, classCode]);

  // ==========================================
  // 3. LOGIC LỌC VÀ TÌM KIẾM
  // ==========================================
  const filteredExams = useMemo(() => {
    return exams.filter(exam => {
      const matchSearch = exam.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = activeFilter === 'Tất cả' || exam.status === activeFilter;
      return matchSearch && matchStatus;
    });
  }, [exams, searchQuery, activeFilter]);

  // Logic phân trang
  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
  const paginatedExams = filteredExams.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ==========================================
  // 4. RENDER GIAO DIỆN CÁC THẺ ĐỀ THI
  // ==========================================
  // --- RENDER CARD VÀ SỬA NAVIGATE ---
  const renderExamCard = ({ item }) => (
    <TouchableOpacity
      style={styles.examCard}
      // Đã sửa tên màn hình thành 'Man_Hinh_Lam_Bai' theo đúng file của bạn
      onPress={() => navigation.navigate('Man_Hinh_Lam_Bai', { examId: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.examTitle}>{item.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'active' ? '#dcfce7' : '#fee2e2' }]}>
          <Text style={[styles.statusText, { color: item.status === 'active' ? '#166534' : '#991b1b' }]}>
            {item.status === 'active' ? 'Sẵn sàng' : 'Đã đóng'}
          </Text>
        </View>
      </View>

      <Text style={styles.examDesc} numberOfLines={2}>{item.description}</Text>

      <View style={styles.cardFooter}>
        <View style={styles.metaInfo}>
          <Ionicons name="time-outline" size={14} color="#64748b" />
          <Text style={styles.metaText}>{item.duration} phút</Text>
          <Ionicons name="help-circle-outline" size={14} color="#64748b" style={{ marginLeft: 10 }} />
          <Text style={styles.metaText}>{item.totalQuestions} câu</Text>
        </View>

        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => navigation.navigate('Man_Hinh_Lam_Bai', { examId: item.id })}
        >
          <Text style={styles.startBtnText}>Vào thi</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER TÌM KIẾM */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Chào mừng,</Text>
          <Text style={styles.userNameText}>{userName}</Text>
        </View>
        <TouchableOpacity style={styles.notifBtn}>
          <Ionicons name="notifications-outline" size={24} color="#1e293b" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#94a3b8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm đề thi của bạn..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setIsFilterModalVisible(true)}
        >
          <Ionicons name="options-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* DANH SÁCH ĐỀ THI */}
      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Đề thi cá nhân ({filteredExams.length})</Text>
          {activeFilter !== 'Tất cả' && (
            <TouchableOpacity onPress={() => setActiveFilter('Tất cả')}>
              <Text style={styles.clearFilterText}>Xóa lọc</Text>
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            {[1, 2, 3].map(i => renderSkeletonExamCard(i))}
          </ScrollView>
        ) : filteredExams.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={80} color="#cbd5e1" />
            <Text style={styles.emptyText}>Bạn chưa tạo đề thi nào hoặc không tìm thấy kết quả.</Text>
            <TouchableOpacity
              style={styles.createNowBtn}
              onPress={() => navigation.navigate('Tao_De_Thi_Part1')}
            >
              <Text style={styles.createNowText}>Tạo đề ngay</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={paginatedExams}
            renderItem={renderExamCard}
            keyExtractor={item => item.id}
            ListFooterComponent={() => (
              totalPages > 1 && (
                <View style={styles.paginationWrapper}>
                  <TouchableOpacity disabled={currentPage === 1} onPress={() => setCurrentPage(p => p - 1)}>
                    <Ionicons name="chevron-back" size={20} color={currentPage === 1 ? "#cbd5e1" : "#3b82f6"} />
                  </TouchableOpacity>

                  {/* KHÔI PHỤC: Logic hiện số trang numBtn cũ của bạn */}
                  <View style={styles.pageNumbersWrapper}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                      <TouchableOpacity
                        key={num}
                        onPress={() => setCurrentPage(num)}
                        style={[styles.numBtn, currentPage === num && styles.numBtnActive]}
                      >
                        <Text style={[styles.numBtnText, currentPage === num && styles.numBtnTextActive]}>{num}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TouchableOpacity disabled={currentPage === totalPages} onPress={() => setCurrentPage(p => p + 1)}>
                    <Ionicons name="chevron-forward" size={20} color={currentPage === totalPages ? "#cbd5e1" : "#3b82f6"} />
                  </TouchableOpacity>
                </View>
              )
            )}
          />
        )}
      </View>

      {/* MODAL BỘ LỌC */}
      <Modal visible={isFilterModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Lọc đề thi</Text>
              <TouchableOpacity onPress={() => setIsFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            {['Tất cả', 'active', 'PRIVATE'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[styles.filterOption, activeFilter === status && styles.filterOptionActive]}
                onPress={() => {
                  setActiveFilter(status);
                  setIsFilterModalVisible(false);
                  setCurrentPage(1);
                }}
              >
                <Text style={[styles.filterOptionText, activeFilter === status && styles.filterOptionTextActive]}>
                  {status === 'active' ? 'Sẵn sàng' : status === 'PRIVATE' ? 'Riêng tư' : 'Tất cả'}
                </Text>
                {activeFilter === status && <Ionicons name="checkmark" size={20} color="#3b82f6" />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: 'white' },
  welcomeText: { fontSize: 14, color: '#64748b' },
  userNameText: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' },
  notifBtn: { width: 45, height: 45, borderRadius: 12, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },

  searchSection: { flexDirection: 'row', paddingHorizontal: 20, marginVertical: 15 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 15, borderWidth: 1, borderColor: '#e2e8f0' },
  searchInput: { flex: 1, height: 45, marginLeft: 10, fontSize: 15 },
  filterBtn: { width: 45, height: 45, backgroundColor: '#3b82f6', borderRadius: 12, marginLeft: 10, justifyContent: 'center', alignItems: 'center' },

  listContainer: { flex: 1, paddingHorizontal: 20 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  listTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  clearFilterText: { color: '#3b82f6', fontWeight: '600' },

  examCard: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 15, borderWidth: 1, borderColor: '#e2e8f0', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  examTitle: { fontSize: 17, fontWeight: 'bold', color: '#1e293b', flex: 1, marginRight: 10 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  examDesc: { fontSize: 14, color: '#64748b', lineHeight: 20, marginBottom: 15 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 12 },
  metaInfo: { flexDirection: 'row' },
  metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 15 },
  metaText: { fontSize: 12, color: '#64748b', marginLeft: 4 },
  startBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  startBtnText: { color: 'white', fontWeight: 'bold', fontSize: 13, marginRight: 4 },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  emptyText: { textAlign: 'center', color: '#94a3b8', marginTop: 15, paddingHorizontal: 40, lineHeight: 22 },
  createNowBtn: { marginTop: 20, backgroundColor: '#3b82f6', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 10 },
  createNowText: { color: 'white', fontWeight: 'bold' },

  pagination: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 20 },
  pageBtn: { padding: 8, backgroundColor: 'white', borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', marginHorizontal: 15 },
  pageBtnDisabled: { opacity: 0.5 },
  pageInfo: { fontSize: 14, fontWeight: '600', color: '#64748b' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  filterOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  filterOptionActive: { backgroundColor: '#f0f7ff', borderRadius: 8, paddingHorizontal: 10 },
  filterOptionText: { fontSize: 16, color: '#475569' },
  filterOptionTextActive: { color: '#3b82f6', fontWeight: 'bold' },
});