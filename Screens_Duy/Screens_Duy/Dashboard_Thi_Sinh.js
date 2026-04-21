// Screens_Duy/Dashboard_Thi_Sinh.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  TextInput, SafeAreaView, Animated 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ==========================================
// 1. COMPONENT SKELETON CHỚP TẮT
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
    <Animated.View
      style={[{ width, height, borderRadius, backgroundColor: '#cbd5e1', opacity }, style]}
    />
  );
};

// Hàm render một thẻ Skeleton bài thi (tách ra để dùng chung)
const renderSkeletonExamCard = (key) => (
  <View key={key} style={styles.examCard}>
     <View style={{flexDirection: 'row', marginBottom: 10}}>
        <SkeletonItem width={70} height={20} style={{marginRight: 8}}/>
        <SkeletonItem width={70} height={20} style={{marginRight: 8}}/>
     </View>
     <SkeletonItem width="80%" height={20} style={{marginBottom: 15}}/>
     <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15}}>
         <SkeletonItem width="40%" height={15}/>
         <SkeletonItem width="40%" height={15}/>
     </View>
     <SkeletonItem width="100%" height={45} borderRadius={8}/>
  </View>
);

// ==========================================
// 2. DỮ LIỆU MẪU (MOCK DATA)
// ==========================================
const mockStats = [
  { id: '1', title: 'Tổng bài thi', value: '12', icon: 'document-text-outline' },
  { id: '2', title: 'Điểm trung bình', value: '8.5', icon: 'star-outline' },
  { id: '3', title: 'Hoàn thành', value: '2/12', icon: 'checkmark-circle-outline' },
  { id: '4', title: 'Sắp tới', value: '6', icon: 'calendar-outline' },
];

const mockExams = Array.from({ length: 12 }).map((_, index) => ({
  id: `e${index + 1}`,
  status: index % 3 === 0 ? 'CO_THE_LAM' : 'SAP_TOI',
  statusText: index % 3 === 0 ? 'CÓ THỂ LÀM' : 'SẮP TỚI',
  subject: index % 2 === 0 ? 'TOÁN HỌC' : 'TIẾNG ANH',
  level: index % 3 === 0 ? 'TRUNG BÌNH' : 'DỄ',
  title: `Bài thi kiểm tra năng lực số ${index + 1}`,
  date: `15/04/2026`,
  time: '60 phút',
}));

// ==========================================
// 3. MAIN COMPONENT
// ==========================================
export default function Dashboard_Thi_Sinh({ navigation }) {
  const [userName, setUserName] = useState('');
  
  // --- STATES ---
  const [isLoading, setIsLoading] = useState(true); // Load lần đầu toàn bộ màn hình
  const [isPageLoading, setIsPageLoading] = useState(false); // Load Skeleton khi chuyển trang
  
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // --- REF CHO FLATLIST ---
  const flatListRef = useRef(null);

  useEffect(() => {
    const loadUserData = async () => {
      setTimeout(async () => {
        try {
          const storedName = await AsyncStorage.getItem('userName');
          if (storedName) setUserName(storedName);
          else {
            await AsyncStorage.setItem('userName', 'Nguyễn Văn A');
            setUserName('Nguyễn Văn A');
          }
        } catch (e) {
          console.error('Failed to load user data', e);
        } finally {
          setIsLoading(false);
        }
      }, 750); 
    };
    
    loadUserData();
  }, []);

  // --- LOGIC PHÂN TRANG ---
  const totalPages = Math.ceil(mockExams.length / ITEMS_PER_PAGE);
  const displayedExams = mockExams.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  // --- HÀM XỬ LÝ KHI NHẤN CHUYỂN TRANG (SỐ N, HOẶC PREV/NEXT) ---
  const handlePageChange = (newPage) => {
    if (newPage === currentPage || isPageLoading) return;

    // 1. Cuộn mượt lên trên (offset 0 là vị trí trên cùng của danh sách, nhưng để đẹp hơn thì cuộn đến vị trí khoảng cách 600px từ trên xuống)
    flatListRef.current?.scrollToOffset({ animated: true, offset: 600 });

    // 2. Kích hoạt chế độ tải trang (chỉ hiện Skeleton cho phần thẻ bài thi)
    setIsPageLoading(true);

    // 3. Chờ 0.75s rồi cập nhật nội dung trang và tắt Skeleton
    setTimeout(() => {
      setCurrentPage(newPage);
      setIsPageLoading(false);
    }, 750);
  };

  // --- RENDER SKELETON LẦN ĐẦU VÀO APP ---
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ padding: 16 }}>
          <View style={styles.topBar}>
             <SkeletonItem width={80} height={20} />
             <SkeletonItem width={40} height={40} borderRadius={20} />
          </View>
          <View style={styles.statsContainer}>
            {[1, 2, 3, 4].map(i => (
              <View key={i} style={styles.statCard}>
                <View>
                  <SkeletonItem width={100} height={12} style={{marginBottom: 8}}/>
                  <SkeletonItem width={40} height={24}/>
                </View>
                <SkeletonItem width={40} height={40} borderRadius={8}/>
              </View>
            ))}
          </View>
          <SkeletonItem width={150} height={24} style={{marginVertical: 15}}/>
          <SkeletonItem width="100%" height={45} borderRadius={8} style={{marginBottom: 20}}/>
          {[1, 2].map(i => renderSkeletonExamCard(`first-load-${i}`))}
        </View>
      </SafeAreaView>
    );
  }

  // --- RENDER DỮ LIỆU ---
  const renderHeader = () => (
    <View>
      <View style={styles.topBar}>
        <Text style={styles.greeting}>Xin chào, <Text style={styles.boldText}>{userName}</Text></Text>
        <View style={styles.avatar}><Text style={styles.avatarText}>N</Text></View>
      </View>

      <View style={styles.statsContainer}>
        {mockStats.map((item) => (
          <View key={item.id} style={styles.statCard}>
            <View>
              <Text style={styles.statTitle}>{item.title}</Text>
              <Text style={styles.statValue}>{item.value}</Text>
            </View>
            <View style={styles.iconWrapper}><Ionicons name={item.icon} size={24} color="#3b82f6" /></View>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Danh sách bài thi</Text>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" />
        <TextInput style={styles.searchInput} placeholder="Tìm kiếm bài thi..." />
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options-outline" size={20} color="gray" />
          <Text style={{marginLeft: 5}}>Bộ lọc</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <Text style={[styles.tabText, styles.activeTab]}>Tất cả ({mockExams.length})</Text>
        <Text style={styles.tabText}>Có thể làm (4)</Text>
      </View>
    </View>
  );

  const renderExamItem = ({ item }) => {
    // KHI ĐANG TẢI TRANG -> TRẢ VỀ SKELETON CARD (giữ nguyên độ mượt cuộn)
    if (isPageLoading) return renderSkeletonExamCard(`skel-${item.id}`);

    const isCanDo = item.status === 'CO_THE_LAM';
    return (
      <View style={styles.examCard}>
        <View style={styles.tagRow}>
          <Text style={[styles.tag, isCanDo ? styles.tagGreen : styles.tagYellow]}>{item.statusText}</Text>
          <Text style={styles.tag}>{item.subject}</Text>
        </View>
        <Text style={styles.examTitle}>{item.title}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}><Ionicons name="calendar-outline" /> {item.date}</Text>
          <Text style={styles.infoText}><Ionicons name="time-outline" /> {item.time}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.actionBtn, isCanDo ? styles.btnPrimary : styles.btnDisabled]}
          disabled={!isCanDo}
          onPress={() => isCanDo && navigation.navigate('Man_Hinh_Lam_Bai', { examId: item.id })}
        >
          <Text style={[styles.actionBtnText, isCanDo ? styles.textPrimary : styles.textDisabled]}>
            {isCanDo ? 'Bắt đầu làm bài' : 'Chưa tới giờ thi'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // --- RENDER PHÂN TRANG (CÓ CÁC NÚT SỐ N) ---
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <View style={styles.paginationContainer}>
        {/* Nút Prev */}
        <TouchableOpacity 
          style={[styles.pageBtn, (currentPage === 1 || isPageLoading) && styles.pageBtnDisabled]}
          disabled={currentPage === 1 || isPageLoading}
          onPress={() => handlePageChange(currentPage - 1)}
        >
          <Ionicons name="chevron-back" size={20} color={(currentPage === 1 || isPageLoading) ? '#94a3b8' : '#3b82f6'} />
        </TouchableOpacity>

        {/* Các Nút Số n */}
        <View style={styles.pageNumbersWrapper}>
            {Array.from({ length: totalPages }).map((_, index) => {
                const page = index + 1;
                const isActive = currentPage === page;
                return (
                    <TouchableOpacity 
                        key={page} 
                        style={[styles.numBtn, isActive && styles.numBtnActive]}
                        disabled={isPageLoading || isActive}
                        onPress={() => handlePageChange(page)}
                    >
                        <Text style={[styles.numBtnText, isActive && styles.numBtnTextActive]}>{page}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>

        {/* Nút Next */}
        <TouchableOpacity 
          style={[styles.pageBtn, (currentPage === totalPages || isPageLoading) && styles.pageBtnDisabled]}
          disabled={currentPage === totalPages || isPageLoading}
          onPress={() => handlePageChange(currentPage + 1)}
        >
          <Ionicons name="chevron-forward" size={20} color={(currentPage === totalPages || isPageLoading) ? '#94a3b8' : '#3b82f6'} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef} // Gắn ref để cuộn
        // Nếu đang tải trang, mảng tạm có 5 phần tử để render đúng 5 cục Skeleton
        data={isPageLoading ? Array(ITEMS_PER_PAGE).fill({}).map((_, i) => ({ id: `temp-${i}` })) : displayedExams}
        keyExtractor={(item) => item.id}
        renderItem={renderExamItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderPagination}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
      />
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc',paddingBottom: 100, paddingTop: 10 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, marginTop: 10 },
  greeting: { fontSize: 16, color: '#64748b' },
  boldText: { fontWeight: 'bold', color: '#0f172a' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#3b82f6', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  
  statsContainer: { flexDirection: 'column',},
  statCard: { width: '100%', backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  statTitle: { fontSize: 13, color: '#64748b', marginBottom: 4 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  iconWrapper: { backgroundColor: '#eff6ff', padding: 10, borderRadius: 8 },
  
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginVertical: 15 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 8, paddingHorizontal: 12, height: 45, marginBottom: 15 },
  searchInput: { flex: 1, marginLeft: 10,fontSize:11 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  tabContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', marginBottom: 20 },
  tabText: { paddingVertical: 10, marginRight: 20, fontSize: 14, color: '#64748b' },
  activeTab: { color: '#3b82f6', fontWeight: 'bold', borderBottomWidth: 2, borderBottomColor: '#3b82f6' },
  
  examCard: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  tagRow: { flexDirection: 'row', marginBottom: 10, alignItems: 'center' },
  tag: { fontSize: 10, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, backgroundColor: '#f1f5f9', color: '#64748b', marginRight: 8, fontWeight: 'bold' },
  tagGreen: { backgroundColor: '#dcfce7', color: '#166534' },
  tagYellow: { backgroundColor: '#fef08a', color: '#854d0e' },
  examTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoText: { fontSize: 13, color: '#64748b', marginBottom: 6 },
  
  actionBtn: { marginTop: 15, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  btnPrimary: { backgroundColor: '#3b82f6' },
  btnDisabled: { backgroundColor: '#e2e8f0' },
  actionBtnText: { fontWeight: 'bold', fontSize: 14 },
  textPrimary: { color: 'white' },
  textDisabled: { color: '#94a3b8' },

  // Styles Phân Trang (Cập nhật có nút số n)
  paginationContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10, paddingVertical: 10 },
  pageBtn: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: 'white', borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', marginHorizontal: 5 },
  pageBtnDisabled: { backgroundColor: '#f8fafc', borderColor: '#f1f5f9' },
  pageNumbersWrapper: { flexDirection: 'row', alignItems: 'center' },
  numBtn: { paddingVertical: 8, paddingHorizontal: 14, backgroundColor: 'white', borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', marginHorizontal: 4 },
  numBtnActive: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  numBtnText: { fontSize: 14, fontWeight: 'bold', color: '#64748b' },
  numBtnTextActive: { color: 'white' },
});