import React, { useState, useContext } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TextInput, TouchableOpacity, Modal, Image, Alert, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { UserContext } from '../context/UserContext';
import { auth } from '../firebaseConfig';

const defaultQuestion = {
  text: '',
  options: ['', '', '', ''],
  correctIndex: null,
  difficulty: 'Medium',
  image: null,
  domain: 'Chung',
};

const TAB_MANUAL = 0;
const TAB_EXCEL = 1;

// ==========================================
// HÀM BÓC TÁCH DỮ LIỆU TỪ FILE VĂN BẢN
// ==========================================
const parseExamData = (rawText) => {
  const cleanText = rawText.replace(/[, \t]+$/gm, '');
  const lines = cleanText.split(/\r?\n/);
  const parsedQuestions = [];
  let currentQuestion = null;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim().replace(/^"|"$/g, '').trim();

    if (line === '') {
      if (currentQuestion && currentQuestion.options.length > 0) {
        parsedQuestions.push(currentQuestion);
        currentQuestion = null;
      }
      continue;
    }

    if (!currentQuestion) {
      currentQuestion = {
        text: line,
        options: [],
        correctIndex: null,
        image: null,
        difficulty: 'Medium',
        domain: 'Chung',
      };
    }
    else {
      if (/^1[\.\)]/.test(line)) {
        currentQuestion.correctIndex = currentQuestion.options.length;
        currentQuestion.options.push(line.replace(/^1[\.\)]\s*/, '').trim());
      }
      else if (/^0[\.\)]/.test(line)) {
        currentQuestion.options.push(line.replace(/^0[\.\)]\s*/, '').trim());
      }
      else {
        if (currentQuestion.options.length === 0) {
          currentQuestion.text += '\n' + line;
        }
      }
    }
  }

  if (currentQuestion && currentQuestion.options.length > 0) {
    parsedQuestions.push(currentQuestion);
  }

  return parsedQuestions;
};

export default function Tao_De_Thi_Part1({ navigation }) {
  const { userName } = useContext(UserContext);

  const [examDesc, setExamDesc] = useState('');
  const [activeTab, setActiveTab] = useState(TAB_MANUAL);

  const [questions, setQuestions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingQ, setEditingQ] = useState(null);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [excelFile, setExcelFile] = useState(null);

  // ==========================================
  // HÀM HIỂN THỊ THÔNG BÁO THÔNG MINH (ĐA NỀN TẢNG)
  // ==========================================
  const showMessage = (title, message) => {
    if (Platform.OS === 'web') {
      window.alert(`${title ? title.toUpperCase() + ':\n' : ''}${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleAddNewQuestion = () => {
    setEditingQ({ ...defaultQuestion });
    setEditingIndex(-1);
    setModalVisible(true);
  };

  const handleEditQuestion = (index) => {
    setEditingQ({ ...questions[index] });
    setEditingIndex(index);
    setModalVisible(true);
  };

  // HÀM XÓA CÓ XÁC NHẬN CHIA PLATFORM
  const handleDeleteQuestion = (index) => {
    const questionText = `Bạn có chắc chắn muốn xóa Câu số ${index + 1} không?`;

    if (Platform.OS === 'web') {
      // Trên Web dùng window.confirm
      const isConfirmed = window.confirm(questionText);
      if (isConfirmed) {
        const updatedQuestions = questions.filter((_, i) => i !== index);
        setQuestions(updatedQuestions);
      }
    } else {
      // Trên Mobile dùng Alert.alert với 2 nút Hủy / Xóa
      Alert.alert(
        "Xác nhận xóa",
        questionText,
        [
          { text: "Hủy", style: "cancel" },
          {
            text: "Xóa",
            style: "destructive",
            onPress: () => {
              const updatedQuestions = questions.filter((_, i) => i !== index);
              setQuestions(updatedQuestions);
            }
          }
        ]
      );
    }
  };

  const handleUpdateOption = (text, optIndex) => {
    const newOptions = [...editingQ.options];
    newOptions[optIndex] = text;
    setEditingQ({ ...editingQ, options: newOptions });
  };

  const handleSaveQuestion = () => {
    if (!editingQ.text.trim()) {
      return showMessage('Lỗi', 'Vui lòng nhập nội dung câu hỏi!');
    }
    if (editingQ.correctIndex === null) {
      return showMessage('Lỗi', 'Vui lòng chọn 1 đáp án đúng (Bấm vào nút tròn)!');
    }

    const newQuestions = [...questions];
    if (editingIndex === -1) {
      newQuestions.push(editingQ);
    } else {
      newQuestions[editingIndex] = editingQ;
    }
    setQuestions(newQuestions);
    setModalVisible(false);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setEditingQ({ ...editingQ, image: result.assets[0].uri });
    }
  };

  const pickExcelFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ['*/*'],
        copyToCacheDirectory: true,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        const file = res.assets[0];
        setExcelFile(file);

        try {
          let fileContent = '';
          if (Platform.OS === 'web') {
            const response = await fetch(file.uri);
            fileContent = await response.text();
          } else {
            fileContent = await FileSystem.readAsStringAsync(file.uri, {
              encoding: FileSystem.EncodingType.UTF8
            });
          }

          const newQuestions = parseExamData(fileContent);

          if (newQuestions.length > 0) {
            setQuestions(prev => [...prev, ...newQuestions]);
            showMessage('Thành công', `Đã trích xuất ${newQuestions.length} câu hỏi từ file!\nHãy kiểm tra lại ở danh sách.`);
            setActiveTab(TAB_MANUAL);
          } else {
            showMessage('Lỗi định dạng', 'Không thể tìm thấy cấu trúc câu hỏi hợp lệ. Đảm bảo dùng: 1. (Đáp án đúng) và 0. (Đáp án sai).');
          }
        } catch (readError) {
          console.error(readError);
          showMessage('Lỗi đọc file', 'Vui lòng lưu file Excel dưới dạng CSV hoặc TSV và thử lại!');
        }
      }
    } catch (err) {
      showMessage('Lỗi', 'Không thể mở trình chọn file.');
    }
  };

  const handleNextStep = () => {
    if (questions.length === 0) {
      return showMessage('Lỗi', 'Vui lòng thêm hoặc tải lên ít nhất 1 câu hỏi!');
    }

    // Đóng gói toàn bộ dữ liệu
    const examData = {
      description: examDesc.trim(),
      questions: questions,
      creatorName: userName, // có tác dụng hiển thị trên giao diện
      creatorUid: auth.currentUser?.uid, // Định danh duy nhất của người tạo
      createdAt: new Date().toISOString(),
    };
    // Truyền sang màn hình Part 2
    navigation.navigate('Tao_De_Thi_Part2', { examData });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Biên soạn nội dung (1/2)</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin giới thiệu</Text>
          <TextInput
            style={[styles.input, { height: 80, textAlignVertical: 'top', marginBottom: 0 }]}
            placeholder="Nhập mô tả ngắn cho bài thi (Không bắt buộc)..."
            multiline
            value={examDesc}
            onChangeText={setExamDesc}
          />
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === TAB_MANUAL && styles.tabBtnActive]}
            onPress={() => setActiveTab(TAB_MANUAL)}
          >
            <Text style={[styles.tabText, activeTab === TAB_MANUAL && styles.tabTextActive]}>Danh sách câu hỏi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === TAB_EXCEL && styles.tabBtnActive]}
            onPress={() => setActiveTab(TAB_EXCEL)}
          >
            <Text style={[styles.tabText, activeTab === TAB_EXCEL && styles.tabTextActive]}>Tải lên từ File</Text>
          </TouchableOpacity>
        </View>

        {activeTab === TAB_MANUAL ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ngân hàng câu hỏi ({questions.length})</Text>

            {questions.length === 0 ? (
              <Text style={{ textAlign: 'center', color: '#94a3b8', marginVertical: 20 }}>
                Chưa có câu hỏi nào. Hãy thêm thủ công hoặc tải file dữ liệu lên.
              </Text>
            ) : (
              questions.map((q, index) => (
                <View key={index} style={styles.questionCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 'bold', color: '#0f172a', marginBottom: 4 }} numberOfLines={2}>
                      Câu {index + 1}: {q.text}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#10b981', fontWeight: '600' }}>
                      Đáp án đúng: Option {q.correctIndex !== null ? q.correctIndex + 1 : 'Chưa chọn'}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                    <TouchableOpacity style={{ padding: 8 }} onPress={() => handleEditQuestion(index)}>
                      <Ionicons name="pencil" size={20} color="#3b82f6" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ padding: 8 }} onPress={() => handleDeleteQuestion(index)}>
                      <Ionicons name="trash" size={20} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}

            <TouchableOpacity style={styles.addQBtn} onPress={handleAddNewQuestion}>
              <Ionicons name="add-circle-outline" size={20} color="white" />
              <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 8 }}>Thêm câu hỏi mới</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tệp dữ liệu (.csv, .txt, .tsv)</Text>
            <Text style={{ fontSize: 13, color: '#64748b', marginBottom: 15, lineHeight: 20 }}>
              * Lưu ý: Hệ thống hỗ trợ đọc định dạng file dữ liệu thô. Nếu lưu từ máy tính, hãy chọn <Text style={{ fontWeight: 'bold', color: '#0f172a' }}>CSV UTF-8</Text>. Nếu tải từ điện thoại, có thể chọn CSV hoặc TSV.
            </Text>

            <TouchableOpacity style={styles.uploadBtn} onPress={pickExcelFile}>
              <Ionicons name="cloud-upload-outline" size={40} color="#3b82f6" />
              <Text style={{ marginTop: 10, color: '#64748b', fontWeight: '500' }}>
                Nhấn để chọn file dữ liệu
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextBtn} onPress={handleNextStep}>
          <Text style={styles.nextBtnText}>Chuyển sang Cấu hình Đề</Text>
          <Ionicons name="settings-outline" size={20} color="white" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>

      {/* MODAL THÊM/SỬA CÂU HỎI */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingIndex === -1 ? 'Biên soạn câu hỏi mới' : `Chỉnh sửa câu ${editingIndex + 1}`}
            </Text>

            <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={false}>
              {editingQ && (
                <>
                  <Text style={styles.label}>Nội dung câu hỏi:</Text>
                  <TextInput
                    style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                    multiline
                    value={editingQ.text}
                    onChangeText={(t) => setEditingQ({ ...editingQ, text: t })}
                    placeholder="Nhập nội dung câu hỏi..."
                  />

                  <TouchableOpacity style={styles.pickImageBtn} onPress={pickImage}>
                    <Ionicons name="image-outline" size={20} color="#64748b" />
                    <Text style={{ color: '#64748b', marginLeft: 8, fontSize: 13 }}>
                      {editingQ.image ? 'Đã đính kèm ảnh (Nhấn để đổi)' : 'Đính kèm hình ảnh minh họa'}
                    </Text>
                  </TouchableOpacity>

                  {editingQ.image && (
                    <Image source={{ uri: editingQ.image }} style={{ width: '100%', height: 200, borderRadius: 8, marginBottom: 15, resizeMode: 'contain' }} />
                  )}

                  <Text style={styles.label}>Tùy chọn đáp án (Chọn Tick xanh cho đáp án đúng):</Text>
                  {editingQ.options.map((opt, i) => (
                    <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                      <TouchableOpacity
                        style={{ marginRight: 10 }}
                        onPress={() => setEditingQ({ ...editingQ, correctIndex: i })}
                      >
                        <Ionicons
                          name={editingQ.correctIndex === i ? "checkmark-circle" : "ellipse-outline"}
                          size={28}
                          color={editingQ.correctIndex === i ? "#10b981" : "#cbd5e1"}
                        />
                      </TouchableOpacity>
                      <TextInput
                        style={[styles.input, { flex: 1, marginBottom: 0 }]}
                        value={opt}
                        onChangeText={(t) => handleUpdateOption(t, i)}
                        placeholder={`Lựa chọn ${i + 1}`}
                      />
                    </View>
                  ))}
                </>
              )}
            </ScrollView>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <TouchableOpacity style={[styles.modalActionBtn, { backgroundColor: '#f1f5f9' }]} onPress={() => setModalVisible(false)}>
                <Text style={{ color: '#64748b', fontWeight: 'bold' }}>Hủy bỏ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalActionBtn, { backgroundColor: '#3b82f6' }]} onPress={handleSaveQuestion}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Lưu câu hỏi</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: 'white', elevation: 2 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  section: { backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 20, elevation: 1 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8 },
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 12, marginBottom: 15, color: '#0f172a' },
  tabContainer: { flexDirection: 'row', backgroundColor: '#e2e8f0', borderRadius: 10, padding: 4, marginBottom: 20 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  tabBtnActive: { backgroundColor: 'white', elevation: 2 },
  tabText: { color: '#64748b', fontWeight: 'bold' },
  tabTextActive: { color: '#3b82f6' },
  addQBtn: { flexDirection: 'row', backgroundColor: '#10b981', padding: 14, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  questionCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, backgroundColor: '#f8fafc', borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  uploadBtn: { borderWidth: 2, borderColor: '#bfdbfe', borderStyle: 'dashed', borderRadius: 12, padding: 30, alignItems: 'center', backgroundColor: '#eff6ff' },
  pickImageBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, backgroundColor: '#f1f5f9', borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#e2e8f0' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', padding: 20, borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  nextBtn: { flexDirection: 'row', backgroundColor: '#1e3a8a', paddingVertical: 16, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  nextBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', backgroundColor: 'white', borderRadius: 16, padding: 20, maxHeight: '85%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 15, textAlign: 'center' },
  modalActionBtn: { flex: 1, paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 }
});