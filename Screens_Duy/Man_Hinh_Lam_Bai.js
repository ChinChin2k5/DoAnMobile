// Screens_Duy/Man_Hinh_Lam_Bai.js
import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, 
  ScrollView, Animated, Dimensions, Image, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- IMPORT FIREBASE VÀ CONTEXT ---
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { UserContext } from '../context/UserContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// ==========================================
// 1. COMPONENT SKELETON CHỚP TẮT (Giữ nguyên)
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

export default function Man_Hinh_Lam_Bai({ navigation, route }) {
  const { userName } = useContext(UserContext); // Lấy tên user để lưu lịch sử
  
  // --- NHẬN DỮ LIỆU TỪ ROUTE PARAMS (TỪ DASHBOARD TRUYỀN SANG) ---
  const { 
    examId = 'e1', 
    title = 'Đang tải bài thi...',
    duration = 15, // Thời gian thi (phút) nhận từ Part 2
    questions = [] // Mảng câu hỏi thực tế tạo từ Part 1
  } = route?.params || {};

  // --- CHUYỂN ĐỔI DATA CÂU HỎI TỪ Tao_De_Thi_PART 1 SANG FORMAT CỦA MÀN LÀM BÀI ---
  // hàm 'useMemo' để dịch mảng questions (được gửi sang từ firebase qua Dashboard thành)
  const questionsList = useMemo(() => {
    if (questions.length === 0) return []; // Tránh lỗi nếu không có câu hỏi
    return questions.map((q, i) => ({
        id: `q${i}`,
        content: q.text || 'Câu hỏi trống',
        correctIndex: q.correctIndex, // Lưu lại đáp án đúng (0,1,2 tương ứng A,B,C)
        options: q.options.map((optText, optIdx) => ({
            id: String(optIdx), // '0', '1', '2'
            text: optText
        }))
    }));
  }, [questions]);

  // --- STATES ---
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState([]);
  
  // Tính tổng số giây dựa trên 'duration' thay vì fix cứng 40 phút
  const initialSeconds = duration * 60;
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [targetEndTime, setTargetEndTime] = useState(null); 
  const [isReady, setIsReady] = useState(false); 
  const [isSheetVisible, setIsSheetVisible] = useState(false);

  const currentQuestion = questionsList[currentIndex] || { content: '', options: [] };
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // =========================================================
  // 2. KHỞI TẠO BÀI THI & ĐỒNG BỘ THỜI GIAN
  // =========================================================
  useEffect(() => {
    if (questionsList.length === 0) {
        Alert.alert("Lỗi", "Bài thi này không có câu hỏi nào!", [{ text: "Trở về", onPress: () => navigation.goBack() }]);
        return;
    }

    const initExam = async () => {
      try {
        const savedData = await AsyncStorage.getItem(`exam_progress_${examId}`);
        if (savedData) {
          const { savedAnswers, savedFlagged, endTime } = JSON.parse(savedData);
          if (savedAnswers) setAnswers(savedAnswers);
          if (savedFlagged) setFlagged(savedFlagged);
          
          if (endTime) {
            const remaining = Math.round((endTime - Date.now()) / 1000);
            if (remaining > 0) {
              setTargetEndTime(endTime);
              setTimeLeft(remaining);
            } else {
              setTimeLeft(0);
              handleForceSubmit();
              return;
            }
          }
        } else {
          const newEndTime = Date.now() + initialSeconds * 1000; 
          setTargetEndTime(newEndTime);
          setTimeLeft(initialSeconds);
          await AsyncStorage.setItem(`exam_progress_${examId}`, JSON.stringify({
            savedAnswers: {}, savedFlagged: [], endTime: newEndTime
          }));
        }
        setIsReady(true); 
      } catch (e) { console.error("Lỗi khởi tạo bài thi", e); }
    };
    
    const timer = setTimeout(() => {
      initExam().finally(() => setIsLoading(false));
    }, 750);
    return () => clearTimeout(timer);
  }, [examId, questionsList]);

  useEffect(() => {
    if (isReady && targetEndTime) {
      AsyncStorage.setItem(`exam_progress_${examId}`, JSON.stringify({
        savedAnswers: answers, savedFlagged: flagged, endTime: targetEndTime
      })).catch(e => console.error("Lỗi đồng bộ", e));
    }
  }, [answers, flagged, targetEndTime, isReady]);

  useEffect(() => {
    if (!targetEndTime || timeLeft <= 0) return;
    const timer = setInterval(() => {
      const remaining = Math.round((targetEndTime - Date.now()) / 1000);
      if (remaining <= 0) {
        clearInterval(timer);
        setTimeLeft(0);
        Alert.alert("Hết giờ!", "Hệ thống tự động nộp bài của bạn.", [
          { text: "Đồng ý", onPress: handleForceSubmit }
        ]);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetEndTime]);

  // =========================================================
  // 3. LOGIC LÀM BÀI VÀ NỘP BÀI
  // =========================================================
  const handleSelectOption = (optionId) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  const toggleFlag = () => {
    setFlagged(prev => 
      prev.includes(currentQuestion.id) 
        ? prev.filter(id => id !== currentQuestion.id) 
        : [...prev, currentQuestion.id]
    );
  };

  const navigateToQuestion = (index) => {
    setCurrentIndex(index);
    if (isSheetVisible) closeBottomSheet();
  };

  const handleSubmit = () => {
    Alert.alert("Nộp bài", "Bạn có chắc chắn muốn nộp bài không?", [
      { text: "Hủy", style: "cancel" },
      { text: "Đồng ý", onPress: handleForceSubmit }
    ]);
  };

  // HÀM CHÍNH: XỬ LÝ CHẤM ĐIỂM & ĐẨY LÊN FIREBASE
  const handleForceSubmit = async () => {
    await AsyncStorage.removeItem(`exam_progress_${examId}`);
    
    let correctCount = 0;
    questionsList.forEach(q => {
        if (answers[q.id] === String(q.correctIndex)) {
            correctCount++;
        }
    });
    const score = ((correctCount / questionsList.length) * 10).toFixed(2);
    const timeTaken = initialSeconds - timeLeft;

    // GÓI DỮ LIỆU CHUẨN ĐỂ TRUYỀN SANG MÀN HÌNH KẾT QUẢ
    const resultData = {
        examId: examId,
        examTitle: title,
        studentName: userName, // Bổ sung tên thí sinh
        score: Number(score),
        correctCount: correctCount,
        totalQuestions: questionsList.length,
        timeTaken: timeTaken,
        answersMap: answers,
        questionsList: questionsList
    };

    try {
        await addDoc(collection(db, "History"), {
            ...resultData,
            completedAt: serverTimestamp(),
        });
    } catch (e) {
        console.error("Lỗi khi lưu lịch sử: ", e);
    }

    const allowRetake = route?.params?.rawConfig?.rules?.allowRetake || false;

    if (allowRetake) {
      //Nếu cho phép thi lại nhiều lần, Screen này sẽ hiện ra
        navigation.replace('Ket_Qua_Dummy', { resultData });
    } else {
        // TRUYỀN DỮ LIỆU ĐI: Đảm bảo nhận các dữ liệu của bài thi này { resultData }
        navigation.replace('Ket_Qua_Va_Phan_Tich', { resultData });
    }
  };

  const progressPercent = questionsList.length > 0 
    ? Math.round((Object.keys(answers).length / questionsList.length) * 100) 
    : 0;

  const formatTime = (seconds) => {
    if (seconds < 0) seconds = 0;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const openBottomSheet = () => {
    setIsSheetVisible(true);
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true })
    ]).start();
  };

  const closeBottomSheet = () => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: SCREEN_HEIGHT, duration: 250, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true })
    ]).start(() => setIsSheetVisible(false));
  };

  // ... (PHẦN RENDER SKELETON)
  // if (isLoading || !isReady) {
  //   return (
  //     <SafeAreaView style={styles.container}>
  //         {/* Bạn có thể paste lại toàn bộ giao diện Skeleton cũ vào đây cho gọn */}
  //         <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text>Đang tải bài thi...</Text></View>
  //     </SafeAreaView>
  //   );
  // }
  if (isLoading || !isReady) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Skeleton Header: Nút back, Tiêu đề bài thi và Avatar */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <SkeletonItem width={24} height={24} borderRadius={12} />
            <SkeletonItem width="60%" height={20} style={{ marginLeft: 15 }} />
          </View>
          <SkeletonItem width={36} height={36} borderRadius={18} />
        </View>

        {/* Skeleton Progress Bar: Thanh tiến độ và phần trăm */}
        <View style={styles.progressSection}>
          <SkeletonItem width="85%" height={6} borderRadius={3} style={{ marginRight: 12 }} />
          <SkeletonItem width={30} height={14} />
        </View>

        {/* Skeleton Timer: Khối thời gian đếm ngược */}
        <View style={styles.timerContainer}>
          <SkeletonItem width={60} height={20} />
        </View>

        {/* Skeleton Question Header: Số thứ tự câu và các nút công cụ */}
        <View style={styles.questionHeader}>
          <SkeletonItem width={100} height={24} />
          <View style={styles.actionIcons}>
            <SkeletonItem width={36} height={36} borderRadius={8} />
            <SkeletonItem width={36} height={36} borderRadius={8} style={{ marginLeft: 10 }} />
          </View>
        </View>

        {/* Skeleton Content: Nội dung câu hỏi và các đáp án */}
        <ScrollView style={styles.contentArea} showsVerticalScrollIndicator={false}>
          <View style={styles.questionCard}>
            <SkeletonItem width="100%" height={20} style={{ marginBottom: 8 }} />
            <SkeletonItem width="90%" height={20} style={{ marginBottom: 8 }} />
            <SkeletonItem width="60%" height={20} />
          </View>

          <View style={styles.optionsContainer}>
            {/* Tạo giả 4 đáp án A, B, C, D */}
            {[1, 2, 3, 4].map((item) => (
              <View key={item} style={styles.optionItem}>
                <SkeletonItem width={22} height={22} borderRadius={11} style={{ marginRight: 15 }} />
                <SkeletonItem width="80%" height={20} />
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Skeleton Footer: 2 nút điều hướng Trái/Phải */}
        <View style={styles.footer}>
          <SkeletonItem width="48%" height={50} borderRadius={8} />
          <SkeletonItem width="48%" height={50} borderRadius={8} />
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================
  // RENDER GIAO DIỆN LÀM BÀI THẬT
  // ==========================================
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#1e293b" />
          <Text style={styles.backText} numberOfLines={1}>{title}</Text>
        </TouchableOpacity>
        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png' }} style={styles.avatar} />
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>
        <Text style={styles.progressText}>{progressPercent}%</Text>
      </View>

      <View style={styles.timerContainer}>
        <Ionicons name="time-outline" size={18} color="#1d4ed8" />
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
      </View>

      <View style={styles.questionHeader}>
        <Text style={styles.questionNumber}>Câu {currentIndex + 1}/{questionsList.length}</Text>
        <View style={styles.actionIcons}>
          <TouchableOpacity 
            style={[styles.iconBtn, flagged.includes(currentQuestion.id) && { backgroundColor: '#fef08a' }]} 
            onPress={toggleFlag}
          >
            <Ionicons name={flagged.includes(currentQuestion.id) ? "flag" : "flag-outline"} size={20} color={flagged.includes(currentQuestion.id) ? "#ca8a04" : "#475569"} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={openBottomSheet}>
            <Ionicons name="grid-outline" size={20} color="#475569" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.contentArea} showsVerticalScrollIndicator={false}>
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{currentQuestion.content}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option) => {
            const isSelected = answers[currentQuestion.id] === option.id;
            return (
              <TouchableOpacity 
                key={option.id}
                style={[styles.optionItem, isSelected && styles.optionItemSelected]}
                onPress={() => handleSelectOption(option.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                  {isSelected && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.optionText}>{option.text}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.footerBtnOutline, currentIndex === 0 && { opacity: 0.5 }]} 
          disabled={currentIndex === 0}
          onPress={() => navigateToQuestion(currentIndex - 1)}
        >
          <Text style={styles.footerBtnOutlineText}>Câu trước</Text>
        </TouchableOpacity>
        
        {currentIndex === questionsList.length - 1 ? (
          <TouchableOpacity style={[styles.footerBtnPrimary, { backgroundColor: '#b91c1c' }]} onPress={handleSubmit}>
            <Text style={styles.footerBtnPrimaryText}>Nộp bài</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.footerBtnPrimary} onPress={() => navigateToQuestion(currentIndex + 1)}>
            <Text style={styles.footerBtnPrimaryText}>Câu sau</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* BOTTOM SHEET */}
      {isSheetVisible && (
        <View style={styles.overlayContainer}>
          <Animated.View style={[styles.overlayBg, { opacity: fadeAnim }]}>
            <TouchableOpacity style={{ flex: 1 }} onPress={closeBottomSheet} />
          </Animated.View>

          <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Bảng câu hỏi</Text>
              <View style={styles.sheetBadge}>
                <Text style={styles.sheetBadgeText}>{questionsList.length} câu</Text>
              </View>
            </View>

            <View style={styles.legendContainer}>
              <View style={styles.legendCol}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#1d4ed8', opacity: 0.8 }]} />
                  <Text style={styles.legendText}>Đã trả lời</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={styles.legendDotWrapper}>
                     <View style={styles.legendFlagIcon}><Ionicons name="flag" size={10} color="white" /></View>
                  </View>
                  <Text style={styles.legendText}>Đã cắm cờ</Text>
                </View>
              </View>
              <View style={styles.legendCol}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { borderColor: '#3b82f6', borderWidth: 2 }]} />
                  <Text style={styles.legendText}>Đang làm</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#8896a9'  }]} />
                  <Text style={styles.legendText}>Chưa xem</Text>
                </View>
              </View>
            </View>

            <ScrollView style={{ maxHeight: 320 }} showsVerticalScrollIndicator={false}>
                <View style={styles.gridContainer}>
                {questionsList.map((q, i) => {
                    const isCurrent = i === currentIndex;
                    const isFlagged = flagged.includes(q.id);
                    const isAnswered = !!answers[q.id];

                    return (
                      <TouchableOpacity 
                          key={q.id} 
                          style={[
                            styles.gridBox, 
                            isAnswered ? styles.gridBoxAnswered : styles.gridBoxDefault,
                            isCurrent && styles.gridBoxCurrent
                          ]}
                          onPress={() => navigateToQuestion(i)}
                      >
                          <Text style={[styles.gridText, isAnswered ? styles.gridTextAnswered : styles.gridTextDefault]}>
                            {i + 1}
                          </Text>
                          {isFlagged && (
                            <View style={styles.flagBadge}>
                               <Ionicons name="flag" size={10} color="white" />
                            </View>
                          )}
                      </TouchableOpacity>
                    );
                })}
                </View>
            </ScrollView>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Ionicons name="log-out-outline" size={20} color="white" style={{ marginRight: 8, transform: [{rotate: '-90deg'}] }} />
              <Text style={styles.submitBtnText}>Nộp bài</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingTop: 40, paddingBottom: 30 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 15 },
  backBtn: { flexDirection: 'row', alignItems: 'center',flex: 1, marginRight: 10 },
  backText: { fontSize: 16, color: '#1e293b', marginLeft: '4%', fontWeight: 'bold' },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#e2e8f0' },
  progressSection: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 15 },
  progressBarBg: { flex: 1, height: 6, backgroundColor: '#e2e8f0', borderRadius: 3, marginRight: 12 },
  progressBarFill: { height: 6, backgroundColor: '#2563eb', borderRadius: 3 },
  progressText: { fontSize: 14, fontWeight: 'bold', color: '#1e293b', width: 35, textAlign: 'right' },
  timerContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  timerText: { fontSize: 16, fontWeight: 'bold', color: '#1d4ed8', marginLeft: 6 },
  questionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 16 },
  questionNumber: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  actionIcons: { flexDirection: 'row' },
  iconBtn: { padding: 8, backgroundColor: '#f1f5f9', borderRadius: 8, marginLeft: 10 },
  contentArea: { flex: 1, paddingHorizontal: 16, height: 0 },
  questionCard: { backgroundColor: 'white', padding: 20, borderRadius: 12, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  questionText: { fontSize: 16, lineHeight: 24, fontWeight: '600', color: '#0f172a' },
  optionsContainer: { paddingBottom: 20 },
  optionItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#f1f5f9' },
  optionItemSelected: { backgroundColor: '#e0e7ff', borderColor: '#818cf8' },
  radioCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#cbd5e1', alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  radioCircleSelected: { borderColor: '#4f46e5' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#4f46e5' },
  optionText: { flex: 1, fontSize: 15, color: '#334155', lineHeight: 22 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: 'white', borderTopWidth: 1, borderColor: '#f1f5f9' },
  footerBtnOutline: { flex: 1, paddingVertical: 14, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center', marginRight: 8 },
  footerBtnOutlineText: { fontSize: 16, fontWeight: '600', color: '#0f172a' },
  footerBtnPrimary: { flex: 1, paddingVertical: 14, borderRadius: 8, backgroundColor: '#2563eb', alignItems: 'center', marginLeft: 8 },
  footerBtnPrimaryText: { fontSize: 16, fontWeight: '600', color: 'white' },

  overlayContainer: { ...StyleSheet.absoluteFillObject, zIndex: 999, justifyContent: 'flex-end' },
  overlayBg: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  bottomSheet: { backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sheetTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  sheetBadge: { backgroundColor: '#f1f5f9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  sheetBadgeText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  legendContainer: { flexDirection: 'row', marginBottom: 20 },
  legendCol: { flex: 1 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  legendDot: { width: 16, height: 16, borderRadius: 8, marginRight: 8 },
  legendText: { fontSize: 12, color: '#475569' },
  legendDotWrapper: { position: 'relative', marginRight: 8 },
  legendFlagIcon: { position: 'relative', top: -4, right: -0, backgroundColor: '#eab308', width: 16, height: 16, borderRadius: 6, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'white' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', marginHorizontal: -5, paddingBottom: 20 },
  
  gridBox: { 
    width: '17.5%', aspectRatio: 1, margin: '1.2%', borderRadius: 8, 
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: 'transparent',
    position: 'relative'
  },
  gridText: { fontSize: 15, fontWeight: '600' },
  gridBoxDefault: { backgroundColor: '#f1f5f9' },
  gridTextDefault: { color: '#64748b' },
  gridBoxAnswered: { backgroundColor: '#dbeafe' },
  gridTextAnswered: { color: '#1d4ed8' },
  gridBoxCurrent: { borderColor: '#3b82f6' },
  
  flagBadge: { 
    position: 'absolute', top: -5, right: -5, 
    backgroundColor: '#eab308', width: 18, height: 18, borderRadius: 9, 
    justifyContent: 'center', alignItems: 'center', 
    borderWidth: 2, borderColor: 'white', zIndex: 10
  },
  
  submitBtn: { backgroundColor: '#b91c1c', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 10, marginTop: 10 },
  submitBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});