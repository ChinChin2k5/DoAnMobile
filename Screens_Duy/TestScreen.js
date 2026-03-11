import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Platform, Modal, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Flag, Clock, LayoutGrid, X, ArrowLeft, Bold } from 'lucide-react-native'; // <-- THÊM ICON ĐỒNG HỒ VÀ CỜ

const DUMMY_QUESTIONS = [
  { id: 1, text: 'Thủ đô của Việt Nam là gì?', options: ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Huế'] },
  { id: 2, text: '1 + 1 bằng mấy?', options: ['1', '2', '3', '4'] },
  { id: 3, text: 'Trái Đất hình gì?', options: ['Vuông', 'Tròn', 'Tam giác', 'Cầu'] },
  { id: 4, text: 'Quốc kỳ Việt Nam có màu gì?', options: ['Đỏ sao vàng', 'Xanh trắng', 'Đỏ trắng', 'Vàng xanh'] },
  { id: 5, text: 'Con vật nào được gọi là chúa sơn lâm?', options: ['Hổ', 'Sư tử', 'Báo', 'Voi'] },
  { id: 6, text: 'Nước sôi ở bao nhiêu độ C?', options: ['50°C', '80°C', '100°C', '120°C'] },
  { id: 7, text: 'Hành tinh nào gần Mặt Trời nhất?', options: ['Trái Đất', 'Sao Hỏa', 'Sao Thủy', 'Sao Kim'] },
  { id: 8, text: 'Ai là người viết Truyện Kiều?', options: ['Nguyễn Du', 'Hồ Xuân Hương', 'Nam Cao', 'Nguyễn Trãi'] },
  { id: 9, text: 'Động vật nào biết bay?', options: ['Chó', 'Mèo', 'Chim', 'Cá'] },
  { id: 10, text: '5 x 5 bằng bao nhiêu?', options: ['10', '20', '25', '30'] },
  // { id: 11, text: 'Ngôn ngữ lập trình nào thường dùng cho web?', options: ['JavaScript', 'C', 'Pascal', 'Assembly'] },
  // { id: 12, text: 'Mặt Trời mọc ở hướng nào?', options: ['Tây', 'Đông', 'Nam', 'Bắc'] },
  // { id: 13, text: 'Con vật nào sống dưới nước?', options: ['Cá', 'Chó', 'Mèo', 'Gà'] },
  // { id: 14, text: '3 x 4 bằng bao nhiêu?', options: ['7', '10', '12', '14'] },
  // { id: 15, text: 'Ai là Chủ tịch đầu tiên của Việt Nam?', options: ['Hồ Chí Minh', 'Võ Nguyên Giáp', 'Phạm Văn Đồng', 'Lê Duẩn'] },
  // { id: 16, text: 'HTML viết tắt của gì?', options: ['Hyper Text Markup Language', 'High Text Machine Language', 'Hyper Tool Multi Language', 'Home Tool Markup Language'] },
  // { id: 17, text: 'CSS dùng để làm gì?', options: ['Tạo cấu trúc web', 'Trang trí giao diện web', 'Xử lý dữ liệu', 'Quản lý server'] },
  // { id: 18, text: '10 : 2 bằng bao nhiêu?', options: ['2', '3', '5', '8'] },
  // { id: 19, text: 'Loài động vật nào là động vật có vú?', options: ['Cá voi', 'Cá mập', 'Cá chép', 'Cá ngừ'] },
  // { id: 20, text: 'Thiết bị nào dùng để nhập dữ liệu vào máy tính?', options: ['Bàn phím', 'Màn hình', 'Loa', 'Máy in'] },
  // { id: 21, text: '7 + 8 bằng bao nhiêu?', options: ['13', '14', '15', '16'] },
  // { id: 22, text: 'Ai phát minh ra bóng đèn điện?', options: ['Thomas Edison', 'Newton', 'Einstein', 'Tesla'] },
  // { id: 23, text: 'Đại dương lớn nhất thế giới là gì?', options: ['Thái Bình Dương', 'Đại Tây Dương', 'Ấn Độ Dương', 'Bắc Băng Dương'] },
  // { id: 24, text: 'Cơ quan nào điều khiển cơ thể con người?', options: ['Tim', 'Phổi', 'Não', 'Gan'] },
  // { id: 25, text: '2^3 bằng bao nhiêu?', options: ['6', '8', '9', '12'] },
  // { id: 26, text: 'Ngôn ngữ nào dùng để tạo ứng dụng Android?', options: ['Java', 'Swift', 'PHP', 'Ruby'] },
  // { id: 27, text: 'Tháng nào có 28 ngày?', options: ['Tháng 2', 'Tháng 1', 'Tất cả các tháng', 'Tháng 12'] },
  // { id: 28, text: 'Ai viết tác phẩm Lão Hạc?', options: ['Nam Cao', 'Ngô Tất Tố', 'Nguyễn Du', 'Tô Hoài'] },
  // { id: 29, text: 'Loài chim nào không biết bay?', options: ['Đà điểu', 'Chim sẻ', 'Chim đại bàng', 'Chim én'] },
  // { id: 30, text: 'Thiết bị nào dùng để lưu trữ dữ liệu?', options: ['Ổ cứng', 'Chuột', 'Màn hình', 'Loa'] },
  // { id: 31, text: '4 + 9 bằng bao nhiêu?', options: ['11', '12', '13', '14'] },
  // { id: 32, text: 'Ai là nhà khoa học đưa ra thuyết tương đối?', options: ['Einstein', 'Newton', 'Galileo', 'Darwin'] },
  // { id: 33, text: 'Ngôn ngữ lập trình nào dùng cho iOS?', options: ['Swift', 'Java', 'C#', 'Python'] },
  // { id: 34, text: 'Kim loại nào dẫn điện tốt?', options: ['Đồng', 'Gỗ', 'Nhựa', 'Cao su'] },
  // { id: 35, text: '15 - 7 bằng bao nhiêu?', options: ['6', '7', '8', '9'] },
  // { id: 36, text: 'Hệ điều hành nào phổ biến trên máy tính?', options: ['Windows', 'Android', 'iOS', 'HarmonyOS'] },
  // { id: 37, text: 'Ai là tác giả của Dế Mèn Phiêu Lưu Ký?', options: ['Tô Hoài', 'Nam Cao', 'Nguyễn Nhật Ánh', 'Xuân Diệu'] },
  // { id: 38, text: 'Cơ quan nào giúp con người hô hấp?', options: ['Phổi', 'Tim', 'Gan', 'Dạ dày'] },
  // { id: 39, text: '9 x 3 bằng bao nhiêu?', options: ['18', '24', '27', '30'] },
  // { id: 40, text: 'Thiết bị nào dùng để di chuyển con trỏ trên máy tính?', options: ['Chuột', 'Bàn phím', 'Máy in', 'USB'] }
];

const TEST_DURATION = 15 * 60; // 15 phút (tính bằng giây)
const TEST_STORAGE_KEY = '@doing_test_123'; // sau này cần sử dụng ID động. Lý do: tất cả các bài đang làm dở có thể dùng chung KEY

export default function TestScreen({ navigation }) {
  // 1. Các biến State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [timeLeft, setTimeLeft] = useState(TEST_DURATION); // Thời gian còn lại
  const [flaggedQs, setFlaggedQs] = useState([]); // Danh sách mảng ARRAY các câu hỏi bị cắm cờ (Lưu Index)
  const [isNavModalVisible, setIsNavModalVisible] = useState(false); //bảng điều hướng câu hỏi

  // 2. LOAD DỮ LIỆU CŨ KHI MỞ MÀN HÌNH
  useEffect(() => {
    const loadSavedProgress = async () => {
      try {
        // AsyncStorage chỉ lưu dữ liệu String
        //nên cần 1 hàm lưu trữ AsyncStorage
        const savedDataString = await AsyncStorage.getItem(TEST_STORAGE_KEY);
        if (savedDataString !== null) {
          // chuyển đổi String sang Object
          const savedData = JSON.parse(savedDataString);
          setAnswers(savedData.savedAnswers || {}); //lấy dữ các đáp án trả lời xong
          setCurrentQIndex(savedData.savedIndex || 0);// lấy vị trí câu hỏi đang làm dở

          // Phục hồi thời gian và cờ đang làm dở 
          if (savedData.savedTime) setTimeLeft(savedData.savedTime);
          if (savedData.savedFlags) setFlaggedQs(savedData.savedFlags);
        }
      } catch (error) {
        console.error('Lỗi tải bài làm:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSavedProgress();
  }, []);

  // 3. LOGIC ĐỒNG HỒ ĐẾM NGƯỢC
  useEffect(() => {
    if (isLoading) return; // Đang load thì khoan đếm

    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerInterval); // Dừng đồng hồ
          handleTimeUp(); // Hết giờ thì ép nộp bài
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000); // 1000ms = 1 giây

    // Dọn dẹp đồng hồ khi thoát khỏi màn hình
    return () => clearInterval(timerInterval);
  }, [isLoading]);

  // Hàm ép nộp bài khi hết giờ
  const handleTimeUp = async () => {
    await AsyncStorage.removeItem(TEST_STORAGE_KEY); // Dọn tủ đồ
    if (Platform.OS === 'web') {
      window.alert('Hết giờ! Bài làm của bạn đã được tự động nộp.');
    } else {
      Alert.alert('Hết giờ!', 'Bài làm của bạn đã được tự động nộp.');
    }
    navigation.goBack();
  };

  // Hàm chuyển đổi Giây -> Phút:Giây (VD: 90s -> 01:30)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    // nếu giây và phút < 10 thì thêm 0 vào đầu -> 01:05
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // 4. HÀM CHỌN ĐÁP ÁN (VÀ LƯU VÀO TỦ)
  const handleSelectAnswer = async (selectedOption) => {
    const newAnswers = { ...answers, [currentQIndex]: selectedOption };
    setAnswers(newAnswers);
    saveToStorage(newAnswers, currentQIndex, flaggedQs); // Gọi hàm lưu chung
  };

  // 5. HÀM CẮM CỜ / RÚT CỜ
  const toggleFlag = () => {
    let newFlags = [...flaggedQs];
    // Nếu câu này đã cắm cờ rồi -> Rút cờ ra (Xóa khỏi mảng)
    if (newFlags.includes(currentQIndex)) {
      newFlags = newFlags.filter(index => index !== currentQIndex);
    }
    // Nếu chưa cắm cờ -> Cắm cờ (Thêm vào mảng)
    else {
      newFlags.push(currentQIndex);
    }

    setFlaggedQs(newFlags);
    saveToStorage(answers, currentQIndex, newFlags); // Lưu trạng thái cờ
  };

  // Hàm gom chung việc lưu vào Tủ đồ để code gọn hơn
  const saveToStorage = async (currentAnswers, index, flags) => {
    try {
      const dataToSave = {
        savedAnswers: currentAnswers,
        savedIndex: index,
        savedTime: timeLeft, // Lưu luôn cả thời gian lúc đó
        savedFlags: flags
      };
      await AsyncStorage.setItem(TEST_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Lỗi lưu dữ liệu:', error);
    }
  };

  // 6. HÀM NỘP BÀI CHỦ ĐỘNG
  const handleSubmitTest = async () => {
    if (Platform.OS === 'web') {
      const isConfirm = window.confirm('Bạn có chắc chắn muốn nộp bài?');
      if (isConfirm) {
        await AsyncStorage.removeItem(TEST_STORAGE_KEY);
        window.alert('Thành công! Đã nộp bài.');
        navigation.goBack();
      }
    } else {
      Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn nộp bài?', [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Nộp bài',
          onPress: async () => {
            await AsyncStorage.removeItem(TEST_STORAGE_KEY);
            Alert.alert('Thành công', 'Đã nộp bài!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
          }
        }
      ]);
    }
  };
  // Hàm khi user bấm vào 1 ô trong bảng điều hướng
  const jumpToQuestion = (index) => {
    setCurrentQIndex(index);
    setIsNavModalVisible(false); // Bấm xong thì tự đóng bảng lại
    saveToStorage(answers, index, flaggedQs);
  };
  // --- GIAO DIỆN ---
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text>Đang tải bài thi...</Text>
      </View>
    );
  }

  const currentQuestion = DUMMY_QUESTIONS[currentQIndex];
  const isCurrentFlagged = flaggedQs.includes(currentQIndex);

  return (
    <View style={styles.container}>
{/* --- HÀNG 1: TRỞ VỀ (TRÁI) - ĐỒNG HỒ (PHẢI) --- */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={20} color="#4f46e5" />
          <Text style={styles.backText}>Trở về</Text>
        </TouchableOpacity>

        <View style={styles.timerBox}>
          <Clock size={16} color={timeLeft < 60 ? "#ef4444" : "#4b5563"} />
          <Text style={[styles.timerText, timeLeft < 60 && { color: '#ef4444' }]}>
            {formatTime(timeLeft)}
          </Text>
        </View>
      </View>
      
      {/* THANH HEADER MỚI CÓ NÚT LƯỚI */}
      <View style={styles.topBar}>
        <Text style={styles.headerText}>Câu {currentQIndex + 1}/{DUMMY_QUESTIONS.length}</Text>

        <View style={styles.rightHeaderControls}>

          <TouchableOpacity style={[styles.iconBtn, isCurrentFlagged && styles.iconBtnActive]} onPress={toggleFlag}>
            <Flag size={24} color={isCurrentFlagged ? "#eab308" : "#9ca3af"} fill={isCurrentFlagged ? "#fef08a" : "transparent"} />
          </TouchableOpacity>

          {/* Nút bật Bảng Điều Hướng */}
          <TouchableOpacity style={styles.iconBtn} onPress={() => setIsNavModalVisible(true)}>
            <LayoutGrid size={24} color="#4b5563" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Nội dung câu hỏi */}
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{currentQuestion.text}</Text>
      </View>

      {/* Danh sách đáp án */}
      {currentQuestion.options.map((option, index) => {
        const isSelected = answers[currentQIndex] === option;
        return (
          <TouchableOpacity
            key={index}
            style={[styles.optionBtn, isSelected && styles.optionBtnSelected]}
            onPress={() => handleSelectAnswer(option)}
          >
            <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{option}</Text>
          </TouchableOpacity>
        );
      })}

      {/* Cụm nút Điều hướng dưới đáy */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.navBtn, currentQIndex === 0 && { opacity: 0.5 }]}
          disabled={currentQIndex === 0}
          onPress={() => jumpToQuestion(currentQIndex - 1)}
        >
          <Text style={styles.navBtnText}>Câu trước</Text>
        </TouchableOpacity>

        {currentQIndex < DUMMY_QUESTIONS.length - 1 ? (
          <TouchableOpacity style={styles.navBtn} onPress={() => jumpToQuestion(currentQIndex + 1)}>
            <Text style={styles.navBtnText}>Câu sau</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.navBtn, { backgroundColor: '#10b981' }]} onPress={handleSubmitTest}>
            <Text style={styles.navBtnText}>Nộp bài</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ========================================= */}
      {/* BẢNG ĐIỀU HƯỚNG NHANH (MODAL TRƯỢT TỪ DƯỚI LÊN) */}
      {/* ========================================= */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isNavModalVisible}
        onRequestClose={() => setIsNavModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>

            {/* Thanh tiêu đề của Modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Bảng câu hỏi</Text>
              <TouchableOpacity onPress={() => setIsNavModalVisible(false)} style={styles.closeBtn}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Chú giải màu sắc */}
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}><View style={[styles.legendBox, { backgroundColor: '#e0e7ff' }]} /><Text style={styles.legendText}>Đã làm</Text></View>
              <View style={styles.legendItem}><View style={[styles.legendBox, { borderColor: '#eab308', borderWidth: 2 }]} /><Text style={styles.legendText}>Cắm cờ</Text></View>
              <View style={styles.legendItem}><View style={[styles.legendBox, { backgroundColor: '#fff', borderColor: '#d1d5db', borderWidth: 1 }]} /><Text style={styles.legendText}>Chưa làm</Text></View>
            </View>

            {/* Lưới các câu hỏi */}
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.gridContainer}>
                {DUMMY_QUESTIONS.map((q, index) => {
                  const isAnswered = answers[index] !== undefined; // Đã làm (Có dữ liệu trong answers)
                  const isFlagged = flaggedQs.includes(index);     // Đang bị cắm cờ
                  const isCurrent = currentQIndex === index;       // Đang đứng ở câu này

                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.gridBox,
                        isAnswered && styles.gridBoxAnswered,
                        isFlagged && styles.gridBoxFlagged,
                        isCurrent && styles.gridBoxCurrent
                      ]}
                      onPress={() => jumpToQuestion(index)}
                    >
                      <Text style={[
                        styles.gridBoxText,
                        isAnswered && styles.gridBoxTextAnswered,
                        isCurrent && styles.gridBoxTextCurrent
                      ]}>
                        {index + 1}
                      </Text>

                      {/* Thêm chấm vàng nhỏ nếu có cắm cờ */}
                      {isFlagged && <View style={styles.flagDot} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 20,
    paddingTop: 40,
    paddingBottom: 60
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
backButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor:'#eef2ff',
  borderColor:'#c7d2fe',
  borderWidth: 1,
  width: '37%',
  paddingVertical: 8,
  borderRadius: 20,
  gap: 6,
},

backText:{
  color:'#374151',
  color:'#4f46e5',
  fontSize:14,
  fontWeight:'bold'
},
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937'
  },
  rightHeaderControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  timerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    width:'37%',
    justifyContent:'center',
    borderColor:'#c7d2fe',
  borderWidth: 1,
    gap: 4
  },
  timerText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#4b5563',
    fontVariant: ['tabular-nums']
  },

  iconBtn: {
    padding: 15,
    paddingLeft:17,
    paddingRight:17,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
  },
  iconBtnActive: {
    borderColor: '#eab308',
    backgroundColor: '#fefce8'
  },
  questionCard: {
  backgroundColor: '#ffffff',
  padding: 22,
  borderRadius: 16,
  marginBottom: 22,

  borderWidth: 1,
  borderColor: '#e5e7eb',

  shadowColor: '#000',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 4,

  position: 'relative'
},

questionText: {
  fontSize: 20,
  fontWeight: '600',
  color: '#111827',
  lineHeight: 30
},

  optionBtn: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#d1d5db'
  },
  optionBtnSelected: {
    backgroundColor: '#e0e7ff',
    borderColor: '#6366f1'
  },
  optionText: {
    fontSize: 16,
    color: '#4b5563'
  },
  optionTextSelected: {
    color: '#4f46e5',
    ontWeight: 'bold'
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingTop: 20
  },
  navBtn: {
    backgroundColor: '#6366f1',
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 8,
    flex: 0.45,
    alignItems: 'center'
  },
  navBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },

  // --- STYLE CHO MODAL (BẢNG ĐIỀU HƯỚNG) ---
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937'
  },
  closeBtn: {
    padding: 5
  },

  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  legendBox: {
    width: 16,
    height: 16,
    borderRadius: 4
  },
  legendText: {
    fontSize: 12,
    color: '#6b7280'
  },

  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    paddingBottom: 20
  },
  gridBox: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  gridBoxAnswered: {
    backgroundColor: '#e0e7ff',
    borderColor: '#a5b4fc'
  },
  gridBoxFlagged: {
    borderColor: '#eab308',
    borderWidth: 2
  },
  gridBoxCurrent: {
    borderColor: '#6366f1',
    borderWidth: 3
  },

  gridBoxText: {
    fontSize: 16,
    color: '#4b5563',
    fontWeight: '600'
  },
  gridBoxTextAnswered: {
    color: '#4f46e5'
  },
  gridBoxTextCurrent: {
    color: '#4f46e5',
    fontWeight: 'bold'
  },

  flagDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#eab308',
    borderWidth: 2,
    borderColor: '#fff'
  },
});