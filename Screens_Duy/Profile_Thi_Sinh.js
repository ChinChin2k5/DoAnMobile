// Screens_Duy/Profile_Thi_Sinh.js
import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { UserContext } from '../context/UserContext';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Image, Animated, Alert, Platform,
  Modal, TextInput, KeyboardAvoidingView, Linking,
  RefreshControl, ToastAndroid,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../firebaseConfig';
//từ firebase/auth
import { signOut, updateProfile, deleteUser } from 'firebase/auth';
// từ firebase/firestore
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';//tinh chỉnh tỷ lệ ảnh

// ─────────────────────────────────────────────
// Skeleton
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// Toast helper (cross-platform)
// ─────────────────────────────────────────────
function showToast(msg) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  }
  // iOS: dùng Alert ngắn (không có ToastAndroid trên iOS)
  // Nếu có thư viện react-native-toast-message thì dùng tốt hơn
}

// ─────────────────────────────────────────────
// Bottom Sheet Modal
// ─────────────────────────────────────────────
const BottomSheetModal = ({ visible, onClose, title, children }) => {
  const slideAnim = useRef(new Animated.Value(700)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 65, friction: 11 }).start();
    } else {
      Animated.timing(slideAnim, { toValue: 700, duration: 250, useNativeDriver: true }).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <TouchableOpacity style={modalStyles.backdrop} activeOpacity={1} onPress={onClose} />
      <Animated.View style={[modalStyles.sheet, { transform: [{ translateY: slideAnim }] }]}>
        <View style={modalStyles.handle} />
        <View style={modalStyles.sheetHeader}>
          <Text style={modalStyles.sheetTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={modalStyles.closeBtn}>
            <Ionicons name="close" size={22} color="#64748b" />
          </TouchableOpacity>
        </View>
        {children}
      </Animated.View>
    </Modal>
  );
};

// ─────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────
export default function Profile_Thi_Sinh({ navigation, route }) {
  const { userName, setUserName, setUserRole } = useContext(UserContext) || {};

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  // Stats
  const [avgScore, setAvgScore] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [completion, setCompletion] = useState(0);
  const [historyDocs, setHistoryDocs] = useState([]);

  // Avatar (lưu local base64 hoặc uri)
  const AVATAR_KEY = `profile_avatar_${auth.currentUser?.uid ?? 'anon'}`;
  const [avatarUri, setAvatarUri] = useState(null);

  // Motto
  const DEFAULT_MOTTO = 'Mục tiêu học tập: Nâng cao kiến thức và kỹ năng toàn diện, đạt kết quả cao trong các kỳ thi.';
  const MOTTO_KEY = `profile_motto_${auth.currentUser?.uid ?? 'anon'}`;
  const [motto, setMotto] = useState(DEFAULT_MOTTO);
  const [mottoEdit, setMottoEdit] = useState('');
  const [showMottoModal, setShowMottoModal] = useState(false);

  // Đổi tên
  const [showNameModal, setShowNameModal] = useState(false);
  const [nameEdit, setNameEdit] = useState('');
  const [savingName, setSavingName] = useState(false);

  // Modals
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  //  ====
  // STATE QUẢN LÝ MODAL XÓA TÀI KHOẢN
  //  ====
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  // Chuỗi xác nhận người dùng nhập vào
  const [confirmName, setConfirmName] = useState('');

  // Trạng thái loading để khóa UI trong lúc đang xóa dữ liệu
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);



  //  ====
  // HÀM XÓA TÀI KHOẢN
  //  ====
  const handleDeleteAccount = async () => {

    //  ----
    // VALIDATE:
    // Bắt buộc nhập chính xác tên tài khoản
    // Cơ chế này mô phỏng GitHub:
    // Người dùng phải tự gõ lại tên để tránh xóa nhầm
    //  ----
    if (confirmName.trim() !== userName) {

      // WEB → dùng alert()
      if (Platform.OS === 'web') {
        window.alert('Tên xác nhận không khớp với tài khoản hiện tại.');
      }

      // MOBILE → dùng Alert.alert()
      else {
        Alert.alert(
          'Xác nhận không hợp lệ',
          'Tên nhập vào không khớp với tài khoản hiện tại.'
        );
      }

      return;
    }

    try {

      //  
      // BẮT ĐẦU QUÁ TRÌNH XÓA
      //  
      setIsDeletingAccount(true);

      const user = auth.currentUser;

      // Nếu session đã mất → dừng toàn bộ tiến trình
      if (!user) {
        throw new Error('Không tìm thấy phiên đăng nhập.');
      }

      const uid = user.uid;

      //  
      // KHỞI TẠO FIRESTORE BATCH
      //  
      // Batch giúp gom nhiều thao tác xóa thành 1 transaction
      // → tối ưu hiệu năng
      // → tránh xóa sót dữ liệu
      //  
      const batch = writeBatch(db);



      //  
      // [1] XÓA DOCUMENT USERS
      //  
      // users/{uid}
      //  
      batch.delete(doc(db, 'users', uid));



      //  
      // [2] XÓA TOÀN BỘ HISTORY
      //  
      // Query tất cả lịch sử bài thi thuộc user hiện tại
      //  
      const historyQuery = query(
        collection(db, 'History'),
        where('uid', '==', uid)
      );

      const historySnap = await getDocs(historyQuery);

      //  
      // Đưa từng document vào hàng đợi xóa
      //  
      historySnap.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });



      //  
      // [3] THỰC THI XÓA FIRESTORE
      //  
      await batch.commit();



      //  
      // [4] XÓA FIREBASE AUTH ACCOUNT
      //  
      // Đây là bước xóa tài khoản thật khỏi Authentication
      // Sau bước này:
      // - Email không còn tồn tại
      // - Không thể đăng nhập lại
      // - UID bị hủy vĩnh viễn
      //  
      await deleteUser(user);



      //  
      // [5] DỌN DẸP CACHE CỤC BỘ
      //  
      await AsyncStorage.multiRemove([
        MOTTO_KEY,
        AVATAR_KEY,
      ]);



      //  
      // [6] RESET CONTEXT TOÀN APP
      //  
      if (setUserName) setUserName('Người dùng');
      if (setUserRole) setUserRole('');



      //  
      // [7] ĐÓNG MODAL
      //  
      setIsDeleteModalVisible(false);



      //  
      // [8] THÔNG BÁO THÀNH CÔNG
      //  

      // WEB
      if (Platform.OS === 'web') {
        window.alert(
          'Tài khoản và toàn bộ dữ liệu đã được xóa vĩnh viễn.'
        );
      }

      // MOBILE
      else {
        Alert.alert(
          'Xóa thành công',
          'Tài khoản và dữ liệu đã được dọn dẹp hoàn toàn.'
        );
      }



      //  
      // [9] ĐIỀU HƯỚNG VỀ LOGIN
      //  
      navigation.replace('Login');

    }

    catch (error) {

      console.error('DELETE ACCOUNT ERROR:', error);



      //  
      // FIREBASE SECURITY:
      // Firebase yêu cầu đăng nhập gần đây
      // để thực hiện hành động nhạy cảm
      //  
      if (error.code === 'auth/requires-recent-login') {

        // WEB
        if (Platform.OS === 'web') {
          window.alert(
            'Vì lý do bảo mật, cần đăng nhập lại trước khi xóa tài khoản.'
          );
        }

        // MOBILE
        else {
          Alert.alert(
            'Yêu cầu xác thực lại',
            'Vui lòng đăng xuất và đăng nhập lại trước khi xóa tài khoản.'
          );
        }
      }

      //  
      // CÁC LỖI KHÁC
      //  
      else {

        // WEB
        if (Platform.OS === 'web') {
          window.alert(
            'Không thể hoàn tất quá trình xóa tài khoản.'
          );
        }

        // MOBILE
        else {
          Alert.alert(
            'Lỗi hệ thống',
            'Không thể hoàn tất quá trình xóa tài khoản.'
          );
        }
      }
    }

    finally {

      //  
      // MỞ KHÓA UI giúp thao tác trở lại như bình thường
      //  
      setIsDeletingAccount(false);
    }
  };

  // ─────────────────────────────────────────
  // Tính điểm TB thực tế:
  //   score field trong Firestore là điểm thô (0–10 nếu thang 10, hoặc 0–totalQuestions * hệ số)
  //   → dùng công thức: (correctCount / totalQuestions) * 10, làm tròn 1 chữ số thập phân
  // ─────────────────────────────────────────
  const computeAvgScore = (docs) => {
    if (!docs.length) return 0;
    const total = docs.reduce((sum, d) => {
      if (d.totalQuestions > 0) {
        return sum + (d.correctCount / d.totalQuestions) * 10;
      }
      return sum;
    }, 0);
    return Math.round((total / docs.length) * 10) / 10;
  };

  // ─────────────────────────────────────────
  // Fetch History theo uid (ưu tiên) → fallback studentName
  // ─────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    setFetchError(false);
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    try {
      let snap;
      // Thử lọc theo uid trước (sau khi migrate field uid vào History)
      const qUid = query(collection(db, 'History'), where('uid', '==', uid));
      snap = await getDocs(qUid);

      // Fallback: nếu không có kết quả theo uid → lọc theo studentName
      if (snap.empty && userName) {
        const qName = query(collection(db, 'History'), where('studentName', '==', userName));
        snap = await getDocs(qName);
      }

      const docs = snap.docs.map(d => d.data());
      setHistoryDocs(docs);

      if (!docs.length) {
        setAvgScore(0); setCourseCount(0); setCompletion(0);
        return;
      }

      setAvgScore(computeAvgScore(docs));

      const uniqueExams = new Set(docs.map(d => d.examId).filter(Boolean));
      setCourseCount(uniqueExams.size);

      const totalPct = docs.reduce((sum, d) =>
        sum + (d.totalQuestions > 0 ? (d.correctCount / d.totalQuestions) * 100 : 0), 0);
      setCompletion(Math.round(totalPct / docs.length));

    } catch (err) {
      console.error('[Profile] fetchStats error:', err);
      setFetchError(true);
    }
  }, [userName]);

  // ─────────────────────────────────────────
  // Load motto + avatar từ AsyncStorage
  // ─────────────────────────────────────────
  const loadLocalData = useCallback(async () => {
    try {
      const [savedMotto, savedAvatar] = await Promise.all([
        AsyncStorage.getItem(MOTTO_KEY),
        AsyncStorage.getItem(AVATAR_KEY),
      ]);
      if (savedMotto) setMotto(savedMotto);
      if (savedAvatar) setAvatarUri(savedAvatar);
    } catch (_) { }
  }, [MOTTO_KEY, AVATAR_KEY]);

  // Init
  //  Gộp các logic khởi tạo vào một khu vực
  useEffect(() => {
    const init = async () => {
      await loadLocalData();
      await fetchStats();
      setIsLoading(false);
    };
    init();
  }, []);

  // Logic xử lý điều hướng từ Dashboard (Nên đặt ngay sau Init)
  useEffect(() => {
    if (route.params?.openNotif) {
      setShowNotifyModal(true);
      // Xóa param để tránh việc xoay màn hình hoặc quay lại bị tự động mở tiếp
      navigation.setParams({ openNotif: undefined });
    }
  }, [route.params?.openNotif]);
  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
    showToast('Đã cập nhật dữ liệu');
  }, [fetchStats]);

  // ─────────────────────────────────────────
  // Lưu motto
  // ─────────────────────────────────────────
  const saveMotto = async () => {
    const trimmed = mottoEdit.trim();
    if (!trimmed) return;
    try {
      await AsyncStorage.setItem(MOTTO_KEY, trimmed);
      setMotto(trimmed);
      setShowMottoModal(false);
    } catch (_) {
      Alert.alert('Lỗi', 'Không thể lưu câu truyền cảm hứng.');
    }
  };

  // ─────────────────────────────────────────
  // Chọn avatar từ thư viện ảnh
  // Web  → dùng FileReader API (base64)
  // Mobile → dùng expo-file-system (base64)
  // Đều lưu vào AsyncStorage dưới dạng data URI
  // ─────────────────────────────────────────
  const handlePickAvatar = async () => {
    const TARGET_SIZE = 104;

    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
          const img = new window.Image(); // Dùng window.Image để sửa lỗi constructor
          img.src = ev.target.result;
          img.onload = async () => {
            const canvas = document.createElement('canvas');
            canvas.width = TARGET_SIZE;
            canvas.height = TARGET_SIZE;
            const ctx = canvas.getContext('2d');

            // Xóa canvas để đảm bảo độ trong suốt
            ctx.clearRect(0, 0, TARGET_SIZE, TARGET_SIZE);
            ctx.drawImage(img, 0, 0, TARGET_SIZE, TARGET_SIZE);

            // QUAN TRỌNG: Lưu dưới dạng image/png để giữ độ trong suốt
            const dataUri = canvas.toDataURL('image/png');
            try {
              await AsyncStorage.setItem(AVATAR_KEY, dataUri);
              setAvatarUri(dataUri);
              showToast('Đã cập nhật ảnh đại diện trong suốt');
            } catch {
              Alert.alert('Lỗi', 'Không thể lưu ảnh.');
            }
          };
        };
        reader.readAsDataURL(file);
      };
      input.click();
      return;
    }

    // ── MOBILE: Dùng ImagePicker + ImageManipulator ──────────
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Cần quyền', 'Vui lòng cho phép truy cập thư viện ảnh.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Ép người dùng cắt khung vuông ngay khi chọn
      quality: 0.7,
    });

    if (result.canceled) return;

    try {
      const manipulated = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: TARGET_SIZE, height: TARGET_SIZE } }],
        { format: ImageManipulator.SaveFormat.PNG } // Chuyển sang PNG để giữ alpha channel
      );

      const base64 = await FileSystem.readAsStringAsync(manipulated.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const dataUri = `data:image/png;base64,${base64}`; // Đổi header sang image/png
      await AsyncStorage.setItem(AVATAR_KEY, dataUri);
      setAvatarUri(dataUri);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể xử lý ảnh.');
    }
  };

  // 
  // Đổi tên hiển thị
  //   1. Cập nhật Firebase Auth displayName
  //   2. Cập nhật Firestore users/{uid}.fullName
  //   3. Cập nhật UserContext
  //
  const handleSaveName = async () => {
    const trimmed = nameEdit.trim();
    if (!trimmed || trimmed.length < 2) {
      Alert.alert('Tên không hợp lệ', 'Vui lòng nhập tên ít nhất 2 ký tự.');
      return;
    }
    setSavingName(true);
    try {
      const user = auth.currentUser;
      if (user) {
        // Cập nhật Firebase Auth
        await updateProfile(user, { displayName: trimmed });
        // Cập nhật Firestore
        await updateDoc(doc(db, 'users', user.uid), { fullName: trimmed });
      }
      if (setUserName) setUserName(trimmed);
      setShowNameModal(false);
      showToast('Đã cập nhật tên hiển thị');
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể cập nhật tên. Vui lòng thử lại.');
    } finally {
      setSavingName(false);
    }
  };

  //  
  // ĐĂNG XUẤT TÀI KHOẢN
  //   
  // Hỗ trợ đầy đủ:
  // - Mobile: Alert.alert()
  // - Web: window.confirm()
  // - Reset Context sau khi logout
  // - Điều hướng về Login
  // - Xử lý lỗi đăng xuất
  //   
  const handleSignOut = async () => {

    //   
    // WEB:
    // window.confirm giúp trình duyệt hiển thị popup xác nhận
    //   
    if (Platform.OS === 'web') {

      const xacNhan = window.confirm(
        'Xác nhận đăng xuất? (reset thời gian phiên đăng nhập khỏi Auto Login)'
      );

      // Người dùng nhấn Cancel
      if (!xacNhan) return;

      try {

        //   =====
        // [1] HỦY PHIÊN ĐĂNG NHẬP FIREBASE AUTH
        //   =====
        await signOut(auth);

        //   =====
        // [2] RESET THÔNG TIN USER TRONG CONTEXT
        //   =====
        // Tránh giữ dữ liệu user cũ sau logout
        //   =====
        if (setUserName) setUserName('Người dùng');

        if (setUserRole) setUserRole('');

        //   =====
        // [3] ĐIỀU HƯỚNG VỀ LOGIN
        //   =====
        navigation.replace('Login');

        //   =====
        // [4] THÔNG BÁO THÀNH CÔNG
        //   =====
        window.alert('Đã đăng xuất khỏi hệ thống.');

      }

      catch (error) {

        console.error('SIGN OUT ERROR:', error);

        window.alert(
          'Không thể đăng xuất lúc này. Vui lòng thử lại.'
        );
      }

      return;
    }

    //  
    // MOBILE:
    // Sử dụng Alert.alert() chuẩn React Native
    // 
    Alert.alert(

      //  
      // TIÊU ĐỀ
      //  
      'Đăng xuất',

      //  
      // NỘI DUNG XÁC NHẬN
      //  
      'Xác nhận đăng xuất? (reset thời gian phiên đăng nhập khỏi Auto Login)',

      // 
      // DANH SÁCH BUTTON
      //
      [

        // 
        // NÚT HỦY
        // 
        {
          text: 'Hủy',
          style: 'cancel',
        },

        // 
        // NÚT XÁC NHẬN ĐĂNG XUẤT
        // 
        {
          text: 'Đăng xuất',

          // iOS:
          // Hiển thị màu đỏ cảnh báo
          style: 'destructive',


          //
          // CALLBACK KHI NHẤN ĐĂNG XUẤT
          // 
          onPress: async () => {

            try {

              //   
              // [1] HỦY FIREBASE AUTH SESSION
              //   
              await signOut(auth);

              //   
              // [2] RESET USER CONTEXT
              //   
              if (setUserName) setUserName('Người dùng');

              if (setUserRole) setUserRole('');

              //   
              // [3] ĐIỀU HƯỚNG VỀ LOGIN
              //   
              navigation.replace('Login');



              //   
              // [4] THÔNG BÁO KẾT QUẢ
              //   
              Alert.alert(
                'Thành công',
                'Đã đăng xuất khỏi hệ thống.'
              );

            }

            catch (error) {

              console.error('SIGN OUT ERROR:', error);
              //   
              // XỬ LÝ LỖI
              //   
              Alert.alert(
                'Lỗi hệ thống',
                'Không thể đăng xuất lúc này.'
              );
            }
          },
        },
      ]
    );
  };

  const settingsOptions = [
    { id: '1', title: 'Hồ sơ cá nhân', icon: 'person', iconColor: '#3b82f6', onPress: () => setShowProfileModal(true) },
    { id: '2', title: 'Kết quả học tập', icon: 'clipboard', iconColor: '#3b82f6', onPress: () => setShowResultModal(true) },
    { id: '3', title: 'Thông báo', icon: 'notifications', iconColor: '#3b82f6', onPress: () => setShowNotifyModal(true) },
    { id: '4', title: 'Liên hệ hỗ trợ', icon: 'headset', iconColor: '#3b82f6', onPress: () => setShowContactModal(true) },
    { id: '5', title: 'Đăng xuất', icon: 'log-out-outline', iconColor: '#ef4444', isLogout: true, onPress: handleSignOut },
  ];

  // ─────────────────────────────────────────
  // Skeleton Loading
  // ─────────────────────────────────────────
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
            <SkeletonItem width={104} height={104} borderRadius={52} style={{ marginBottom: 15 }} />
            <SkeletonItem width={150} height={24} style={{ marginBottom: 10 }} />
            <SkeletonItem width={80} height={28} borderRadius={14} style={{ marginBottom: 12 }} />
            <SkeletonItem width={260} height={16} style={{ marginBottom: 4 }} />
            <SkeletonItem width={200} height={16} />
          </View>
          <View style={styles.statsRow}>
            <SkeletonItem width={'45%'} height={85} borderRadius={16} />
            <SkeletonItem width={'45%'} height={85} borderRadius={16} />
          </View>
          <SkeletonItem width={'100%'} height={85} borderRadius={16} style={{ marginTop: 12 }} />
          <View style={[styles.settingsSection, { marginTop: 24 }]}>
            {[1, 2, 3, 4, 5].map(i => (
              <View key={i} style={styles.settingItem}>
                <SkeletonItem width="100%" height={20} />
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─────────────────────────────────────────
  // Main Render
  // ─────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hồ sơ Cá nhân</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3b82f6']} tintColor="#3b82f6" />
        }
      >
        {/* Error banner */}
        {fetchError && (
          <TouchableOpacity style={styles.errorBanner} onPress={onRefresh}>
            <Ionicons name="cloud-offline-outline" size={16} color="#b91c1c" />
            <Text style={styles.errorText}>Không tải được dữ liệu. Nhấn để thử lại.</Text>
          </TouchableOpacity>
        )}

        {/* Avatar & Name */}
        <View style={styles.profileSection}>
          {/* Avatar — bấm để đổi ảnh */}
          <TouchableOpacity style={styles.avatarContainer} onPress={handlePickAvatar} activeOpacity={0.8}>
            <Image
              source={
                avatarUri
                  ? { uri: avatarUri }
                  : { uri: 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png' }
              }
              style={styles.avatar}
              resizeMode="center" // Để ảnh luôn lấp đầy vòng tròn đẹp mắt
            />
            {/* Camera badge */}
            <View style={styles.cameraBadge}>
              <Ionicons name="camera" size={12} color="#fff" />
            </View>
          </TouchableOpacity>

          {/* Tên — bấm để đổi */}
          <TouchableOpacity
            style={styles.userNameRow}
            onPress={() => { setNameEdit(userName || ''); setShowNameModal(true); }}
            activeOpacity={0.7}
          >
            <Text style={styles.userName}>{userName || 'Người dùng'}</Text>
            <Ionicons name="pencil-outline" size={15} color="#93c5fd" style={{ marginLeft: 6 }} />
          </TouchableOpacity>

          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>HỌC SINH</Text>
          </View>

          {/* Motto */}
          <TouchableOpacity
            style={styles.mottoContainer}
            onPress={() => { setMottoEdit(motto); setShowMottoModal(true); }}
            activeOpacity={0.75}
          >
            <Text style={styles.mottoText}>{motto}</Text>
            <Ionicons name="pencil-outline" size={13} color="#93c5fd" style={{ marginTop: 4 }} />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>ĐIỂM TB</Text>
            <Text style={styles.statValue}>{avgScore}</Text>
            <Text style={styles.statSub}>/ 10</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>KHÓA HỌC</Text>
            <Text style={styles.statValue}>{courseCount}</Text>
            <Text style={styles.statSub}>đề thi</Text>
          </View>
        </View>
        <View style={[styles.statCard, styles.statCardFull]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <Text style={styles.statLabel}>HOÀN THÀNH</Text>
            <Text style={styles.statValue}>{completion}%</Text>
          </View>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${Math.min(completion, 100)}%` }]} />
          </View>
        </View>

        {/* Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>CÀI ĐẶT TÀI KHOẢN</Text>
          {settingsOptions.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.settingItem}
              onPress={item.onPress}
              activeOpacity={0.7}
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
        <TouchableOpacity
          style={[styles.menuItem, { borderBottomWidth: 0 }]}
          onPress={() => setIsDeleteModalVisible(true)}
        >
          <View style={[styles.menuIcon, { backgroundColor: '#fef2f2' }]}>
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </View>
          <Text style={[styles.menuText, { color: '#ef4444' }]}>Xóa tài khoản</Text>
          <Ionicons name="chevron-forward" size={18} color="#ef4444" />
        </TouchableOpacity>
      </ScrollView>

      {/* ══ MODAL: Motto ══ */}
      <Modal visible={showMottoModal} transparent animationType="fade" onRequestClose={() => setShowMottoModal(false)}>
        <KeyboardAvoidingView
          style={modalStyles.centeredOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={modalStyles.mottoBox}>
            <Text style={modalStyles.mottoBoxTitle}>✏️ Chỉnh sửa câu truyền cảm hứng</Text>
            <TextInput
              style={modalStyles.mottoInput}
              value={mottoEdit}
              onChangeText={setMottoEdit}
              multiline
              maxLength={200}
              placeholder="Nhập câu truyền cảm hứng của bạn..."
              placeholderTextColor="#94a3b8"
              autoFocus
            />
            <Text style={modalStyles.charCount}>{mottoEdit.length}/200</Text>
            <View style={modalStyles.mottoActions}>
              <TouchableOpacity style={[modalStyles.mottoBtn, { backgroundColor: '#f1f5f9' }]} onPress={() => setShowMottoModal(false)}>
                <Text style={{ color: '#64748b', fontWeight: '600' }}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[modalStyles.mottoBtn, { backgroundColor: '#3b82f6' }]} onPress={saveMotto}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ══ MODAL: Đổi tên ══ */}
      <Modal visible={showNameModal} transparent animationType="fade" onRequestClose={() => setShowNameModal(false)}>
        <KeyboardAvoidingView
          style={modalStyles.centeredOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={modalStyles.mottoBox}>
            <Text style={modalStyles.mottoBoxTitle}>👤 Đổi tên hiển thị</Text>
            <TextInput
              style={[modalStyles.mottoInput, { minHeight: 50, textAlignVertical: 'center' }]}
              value={nameEdit}
              onChangeText={setNameEdit}
              maxLength={50}
              placeholder="Nhập tên hiển thị mới..."
              placeholderTextColor="#94a3b8"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSaveName}
            />
            <View style={modalStyles.mottoActions}>
              <TouchableOpacity style={[modalStyles.mottoBtn, { backgroundColor: '#f1f5f9' }]} onPress={() => setShowNameModal(false)}>
                <Text style={{ color: '#64748b', fontWeight: '600' }}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[modalStyles.mottoBtn, { backgroundColor: savingName ? '#93c5fd' : '#3b82f6' }]}
                onPress={handleSaveName}
                disabled={savingName}
              >
                <Text style={{ color: '#fff', fontWeight: '700' }}>{savingName ? 'Đang lưu...' : 'Lưu'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ══ BOTTOM SHEET: Hồ sơ cá nhân ══ */}
      <BottomSheetModal visible={showProfileModal} onClose={() => setShowProfileModal(false)} title="👤 Hồ sơ cá nhân">
        <ScrollView style={{ maxHeight: 420 }} contentContainerStyle={{ padding: 20 }}>
          <ProfileInfoRow icon="person-outline" label="Họ tên" value={userName || '—'} />
          <ProfileInfoRow icon="mail-outline" label="Email" value={auth.currentUser?.email || '—'} />
          <ProfileInfoRow icon="school-outline" label="Vai trò" value="Học sinh" />
          <ProfileInfoRow icon="stats-chart-outline" label="Tổng bài đã làm" value={`${historyDocs.length} bài`} />
          <ProfileInfoRow icon="trophy-outline" label="Điểm trung bình" value={`${avgScore} / 10`} />
          <ProfileInfoRow icon="checkmark-circle-outline" label="Tỉ lệ hoàn thành" value={`${completion}%`} />
          <ProfileInfoRow icon="book-outline" label="Số đề thi khác nhau" value={`${courseCount} đề`} />
          {/* Nút đổi tên từ trong modal */}
          <TouchableOpacity
            style={{ marginTop: 16, backgroundColor: '#eff6ff', borderRadius: 12, padding: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
            onPress={() => { setShowProfileModal(false); setTimeout(() => { setNameEdit(userName || ''); setShowNameModal(true); }, 300); }}
          >
            <Ionicons name="pencil-outline" size={18} color="#3b82f6" />
            <Text style={{ color: '#3b82f6', fontWeight: '700', fontSize: 14 }}>Đổi tên hiển thị</Text>
          </TouchableOpacity>
        </ScrollView>
      </BottomSheetModal>

      {/* ══ BOTTOM SHEET: Kết quả học tập ══ */}
      <BottomSheetModal visible={showResultModal} onClose={() => setShowResultModal(false)} title="📋 Kết quả học tập">
        <ScrollView style={{ maxHeight: 440 }} contentContainerStyle={{ padding: 16 }}>
          {historyDocs.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 30 }}>
              <Ionicons name="document-outline" size={40} color="#cbd5e1" />
              <Text style={{ color: '#94a3b8', marginTop: 10, marginBottom: 16 }}>Chưa có kết quả nào</Text>
              {/* Nút điều hướng sang Lịch sử làm bài dù chưa có data */}
              <TouchableOpacity
                style={resultNavBtn}
                onPress={() => { setShowResultModal(false); navigation.navigate('History'); }}
              >
                <Ionicons name="time-outline" size={16} color="#3b82f6" />
                <Text style={resultNavBtnText}>Xem lịch sử làm bài</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Nút điều hướng sang màn hình đầy đủ */}
              <TouchableOpacity
                style={[resultNavBtn, { marginBottom: 12 }]}
                onPress={() => { setShowResultModal(false); navigation.navigate('History'); }}
              >
                <Ionicons name="time-outline" size={16} color="#3b82f6" />
                <Text style={resultNavBtnText}>Xem toàn bộ lịch sử làm bài</Text>
                <Ionicons name="chevron-forward" size={15} color="#3b82f6" style={{ marginLeft: 'auto' }} />
              </TouchableOpacity>

              {/* Danh sách 5 bài gần nhất — tap → Chi_Tiet_Dap_An */}
              {[...historyDocs]
                .sort((a, b) => (b.completedAt?.seconds ?? 0) - (a.completedAt?.seconds ?? 0))
                .slice(0, 5)
                .map((d, idx) => {
                  const scoreOn10 = d.totalQuestions > 0
                    ? Math.round((d.correctCount / d.totalQuestions) * 100) / 10
                    : 0;
                  const date = d.completedAt?.seconds
                    ? new Date(d.completedAt.seconds * 1000).toLocaleDateString('vi-VN')
                    : '—';
                  const scoreColor = scoreOn10 >= 8 ? '#16a34a' : scoreOn10 >= 5 ? '#d97706' : '#dc2626';
                  const scoreBg = scoreOn10 >= 8 ? '#dcfce7' : scoreOn10 >= 5 ? '#fef3c7' : '#fee2e2';
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={resultStyles.card}
                      activeOpacity={0.75}
                      onPress={() => {
                        setShowResultModal(false);
                        // Điều hướng sang Chi_Tiet_Dap_An với đầy đủ data
                        navigation.navigate('Chi_Tiet_Dap_An', { resultData: d });
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={resultStyles.examTitle} numberOfLines={1}>{d.examTitle || 'Bài thi'}</Text>
                        <Text style={resultStyles.examDate}>{date}</Text>
                        <Text style={resultStyles.examSub}>
                          {d.correctCount}/{d.totalQuestions} câu đúng · {Math.floor((d.timeTaken ?? 0) / 60)}p {(d.timeTaken ?? 0) % 60}s
                        </Text>
                      </View>
                      <View style={[resultStyles.scoreBadge, { backgroundColor: scoreBg }]}>
                        <Text style={[resultStyles.scoreText, { color: scoreColor }]}>{scoreOn10.toFixed(1)}</Text>
                        <Text style={[resultStyles.scoreUnit, { color: scoreColor }]}>/10</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color="#cbd5e1" style={{ marginLeft: 6 }} />
                    </TouchableOpacity>
                  );
                })
              }

              {/* Xem thêm nếu có hơn 5 bài */}
              {historyDocs.length > 5 && (
                <TouchableOpacity
                  style={[resultNavBtn, { marginTop: 4 }]}
                  onPress={() => { setShowResultModal(false); navigation.navigate('History'); }}
                >
                  <Text style={[resultNavBtnText, { color: '#64748b' }]}>
                    +{historyDocs.length - 5} bài nữa — xem tất cả
                  </Text>
                  <Ionicons name="chevron-forward" size={15} color="#64748b" style={{ marginLeft: 4 }} />
                </TouchableOpacity>
              )}
            </>
          )}
        </ScrollView>
      </BottomSheetModal>

      {/* ══ BOTTOM SHEET: Thông báo ══ */}
      <BottomSheetModal visible={showNotifyModal} onClose={() => setShowNotifyModal(false)} title="🔔 Thông báo">
        <View style={{ padding: 20 }}>
          <NotifyToggleRow label="Thông báo đề thi mới" storageKey="notify_new_exam" defaultValue={true} />
          <NotifyToggleRow label="Nhắc nhở lịch học" storageKey="notify_schedule" defaultValue={true} />
          <NotifyToggleRow label="Kết quả bài thi" storageKey="notify_result" defaultValue={true} />
          <NotifyToggleRow label="Tin tức & cập nhật" storageKey="notify_news" defaultValue={false} />
          <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 16, textAlign: 'center' }}>
            * Cài đặt thông báo chi tiết trong phần cài đặt hệ thống
          </Text>
        </View>
      </BottomSheetModal>

      {/* ══ BOTTOM SHEET: Liên hệ hỗ trợ ══ */}
      <BottomSheetModal visible={showContactModal} onClose={() => setShowContactModal(false)} title="🎧 Liên hệ hỗ trợ">
        <View style={{ padding: 20 }}>
          <ContactRow icon="mail-outline" label="Email hỗ trợ" value="nguyendinhduy257@gmail.com"
            onPress={() => Linking.openURL('mailto:nguyendinhduy257@gmail.com')} />
          <ContactRow icon="logo-facebook" label="Facebook" value="facebook.com/nguyen.duy.226672"
            onPress={() => Linking.openURL('https://www.facebook.com/nguyen.duy.226672')} />
          <ContactRow icon="call-outline" label="Hotline" value="0396 009 584"
            onPress={() => Linking.openURL('tel:0396009584')} />
          <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 16, textAlign: 'center' }}>
            Hỗ trợ từ 8:00 – 22:00 hằng ngày
          </Text>
        </View>
      </BottomSheetModal>

      {/* Modal Xác nhận xóa tài khoản */}
      <Modal visible={isDeleteModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: '#ef4444' }]}>Xóa tài khoản</Text>
              <TouchableOpacity onPress={() => { setIsDeleteModalVisible(false); setConfirmName(''); }}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <Text style={{ marginBottom: 15, color: '#475569', lineHeight: 20 }}>
              Hành động này không thể hoàn tác. Vui lòng nhập <Text style={{ fontWeight: 'bold' }}>{userName}</Text> để xác nhận.
            </Text>

            <TextInput
              style={[styles.input, { borderColor: confirmName === userName ? '#3b82f6' : '#e2e8f0' }]}
              placeholder="Nhập tên của bạn"
              value={confirmName}
              onChangeText={setConfirmName}
            />

            <TouchableOpacity
              style={[styles.mottoBtn, { backgroundColor: confirmName === userName ? '#ef4444' : '#cbd5e1', marginTop: 10 }]}
              onPress={handleDeleteAccount}
              disabled={confirmName !== userName}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Xác nhận xóa vĩnh viễn</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────
function ProfileInfoRow({ icon, label, value }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
      <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
        <Ionicons name={icon} size={18} color="#3b82f6" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 12, color: '#94a3b8', fontWeight: '500' }}>{label}</Text>
        <Text style={{ fontSize: 15, color: '#1e293b', fontWeight: '600', marginTop: 2 }}>{value}</Text>
      </View>
    </View>
  );
}

function NotifyToggleRow({ label, storageKey, defaultValue }) {
  const [enabled, setEnabled] = useState(defaultValue);
  useEffect(() => {
    AsyncStorage.getItem(storageKey).then(v => { if (v !== null) setEnabled(v === 'true'); });
  }, []);
  const toggle = async () => {
    const next = !enabled;
    setEnabled(next);
    await AsyncStorage.setItem(storageKey, String(next));
  };
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
      <Text style={{ fontSize: 15, color: '#1e293b', fontWeight: '500' }}>{label}</Text>
      <TouchableOpacity
        onPress={toggle}
        style={{ width: 48, height: 28, borderRadius: 14, backgroundColor: enabled ? '#3b82f6' : '#e2e8f0', justifyContent: 'center', paddingHorizontal: 3 }}
      >
        <Animated.View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff', alignSelf: enabled ? 'flex-end' : 'flex-start', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 3, elevation: 2 }} />
      </TouchableOpacity>
    </View>
  );
}

function ContactRow({ icon, label, value, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
        <Ionicons name={icon} size={20} color="#3b82f6" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 12, color: '#94a3b8', fontWeight: '500' }}>{label}</Text>
        <Text style={{ fontSize: 14, color: '#3b82f6', fontWeight: '600', marginTop: 2 }} numberOfLines={1}>{value}</Text>
      </View>
      <Ionicons name="open-outline" size={16} color="#cbd5e1" />
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingTop: Platform.OS === 'android' ? 40 : 40, paddingBottom: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 15 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a' },
  iconBtn: { padding: 4 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  errorBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef2f2', borderRadius: 12, padding: 12, marginBottom: 12, gap: 8 },
  errorText: { color: '#b91c1c', fontSize: 13, flex: 1 },

  profileSection: {
    alignItems: 'center',       // Căn giữa theo chiều ngang
    justifyContent: 'center',    // Căn giữa theo chiều dọc
    paddingVertical: 20,         // Tạo khoảng cách trên dưới
    width: '100%',               // Đảm bảo chiếm hết chiều rộng
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,            // Khoảng cách giữa ảnh và tên
    // Đảm bảo container của avatar cũng căn giữa nội dung bên trong
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: { width: 104, height: 104, borderRadius: 52, backgroundColor: 'transparent', borderWidth: 3, borderColor: '#bfdbfe' },
  cameraBadge: { position: 'absolute', bottom: 2, right: 2, width: 26, height: 26, borderRadius: 13, backgroundColor: '#3b82f6', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  userNameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  userName: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  roleBadge: { backgroundColor: '#bfdbfe', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 12, alignSelf: 'center' },
  roleText: { fontSize: 12, fontWeight: 'bold', color: '#1e3a8a' },
  mottoContainer: { alignItems: 'center', paddingHorizontal: 10, marginTop: 4 },
  mottoText: { fontSize: 13, color: '#475569', textAlign: 'center', lineHeight: 20, fontStyle: 'italic' },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, gap: 12 },
  statCard: { flex: 1, backgroundColor: '#dbeafe', borderRadius: 16, padding: 16 },
  statCardFull: { flex: undefined, marginTop: 12 },
  statLabel: { fontSize: 11, fontWeight: '700', color: '#1e40af', marginBottom: 4 },
  statValue: { fontSize: 28, fontWeight: '800', color: '#1d4ed8' },
  statSub: { fontSize: 12, color: '#3b82f6', fontWeight: '500', marginTop: 2 },
  progressBg: { height: 6, backgroundColor: '#bfdbfe', borderRadius: 3, marginTop: 10, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#3b82f6', borderRadius: 3 },

  settingsSection: { marginTop: 28 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#64748b', marginBottom: 15 },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', padding: 16, borderRadius: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  settingItemLeft: { flexDirection: 'row', alignItems: 'center' },
  settingIconWrapper: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  settingItemTitle: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  // Phần Xóa tài khoản (Menu Item)
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 16,
    marginBottom: 30,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
  },

  // Style cho Modal Xóa tài khoản
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 10,
  },
  mottoBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const modalStyles = StyleSheet.create({
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingBottom: Platform.OS === 'ios' ? 34 : 20, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 20 },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#e2e8f0', alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  sheetTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  closeBtn: { padding: 4 },
  centeredOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  mottoBox: { backgroundColor: '#fff', borderRadius: 20, padding: 20, width: '100%', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 20, elevation: 10 },
  mottoBoxTitle: { fontSize: 15, fontWeight: '700', color: '#1e293b', marginBottom: 12 },
  mottoInput: { borderWidth: 1.5, borderColor: '#bfdbfe', borderRadius: 12, padding: 12, fontSize: 14, color: '#1e293b', minHeight: 100, textAlignVertical: 'top', lineHeight: 22 },
  charCount: { fontSize: 12, color: '#94a3b8', textAlign: 'right', marginTop: 4 },
  mottoActions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  mottoBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
});

// ─────────────────────────────────────────────
// Style objects dùng inline cho result nav button
// (dùng plain object thay vì StyleSheet để reuse qua nhiều chỗ)
// ─────────────────────────────────────────────
const resultNavBtn = {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#eff6ff',
  borderRadius: 12,
  paddingVertical: 10,
  paddingHorizontal: 14,
  gap: 6,
};
const resultNavBtnText = {
  color: '#3b82f6',
  fontSize: 14,
  fontWeight: '700',
};

const resultStyles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#e2e8f0', cursor: Platform.OS === 'web' ? 'pointer' : undefined },
  examTitle: { fontSize: 14, fontWeight: '700', color: '#1e293b', marginBottom: 3 },
  examDate: { fontSize: 12, color: '#94a3b8', marginBottom: 2 },
  examSub: { fontSize: 12, color: '#64748b' },
  scoreBadge: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#dbeafe', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginLeft: 10 },
  scoreText: { fontSize: 22, fontWeight: '800', color: '#1d4ed8' },
  scoreUnit: { fontSize: 11, color: '#3b82f6', fontWeight: '600' },
});