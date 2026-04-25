import React, { useState, useContext } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, ScrollView, 
  TextInput, TouchableOpacity, Modal, FlatList, Image, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker'; // 👈 THÊM
import * as FileSystem from 'expo-file-system';         // 👈 THÊM
import { UserContext } from '../context/UserContext';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// ==========================================
// DANH SÁCH MÔN HỌC CHO DROPDOWN
// ==========================================
const SUBJECT_DOMAINS = [
  'Molecular Biology', 'Mathematics', 'Physics', 'Chemistry',
  'Literature', 'History', 'Geography', 'English',
  'Computer Science', 'Economics',
];

const defaultQuestion = {
  text: '',
  options: ['', '', ''],
  correctIndex: null,
  difficulty: 'Medium',
  image: null,
  domain: 'Molecular Biology',
};

// ==========================================
// TAB INDEX
// ==========================================
const TAB_MANUAL = 0;
const TAB_EXCEL  = 1;

export default function Tao_De_Thi_Part1({ navigation }) {
  const { userRole, classCode, userName } = useContext(UserContext);

  // ----- SHARED STATE -----
  const [activeTab, setActiveTab] = useState(TAB_MANUAL);

  // ----- MANUAL ENTRY STATE -----
  const [questions, setQuestions]       = useState([{ ...defaultQuestion }]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalVisible, setIsModalVisible]           = useState(false);
  const [isDomainDropdownVisible, setIsDomainDropdownVisible] = useState(false);
  const currentQ = questions[currentIndex];

  // ----- EXCEL IMPORT STATE -----
  const [excelFile, setExcelFile]         = useState(null);  // { name, uri }
  const [importedQuestions, setImportedQuestions] = useState([]);
  const [isParsing, setIsParsing]         = useState(false);
  const [parseError, setParseError]       = useState('');

  // ==========================================
  // MANUAL ENTRY — helpers
  // ==========================================
  const updateCurrentQuestion = (field, value) => {
    const updated = [...questions];
    updated[currentIndex] = { ...updated[currentIndex], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (optionIndex, value) => {
    const updated = [...questions];
    const opts = [...updated[currentIndex].options];
    opts[optionIndex] = value;
    updated[currentIndex].options = opts;
    setQuestions(updated);
  };

  const handleAddNewQuestion = () => {
    setQuestions([...questions, { ...defaultQuestion }]);
    setCurrentIndex(questions.length);
    setIsModalVisible(false);
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Cần cấp quyền', 'Vui lòng cho phép truy cập thư viện ảnh.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) updateCurrentQuestion('image', result.assets[0].uri);
  };

  // ==========================================
  // EXCEL IMPORT — helpers
  // ==========================================

  /**
   * Parse CSV thủ công (không cần thư viện nặng).
   * Định dạng file mẫu:
   *   question,optionA,optionB,optionC,correctIndex,difficulty,domain
   *   "Câu hỏi 1","Đáp án A","Đáp án B","Đáp án C",0,Easy,Mathematics
   */
  const parseCSV = (csvText) => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) throw new Error('File phải có ít nhất 1 dòng dữ liệu (sau header).');

    // Bỏ dòng header
    const dataLines = lines.slice(1);

    return dataLines.map((line, idx) => {
      // Tách cột, xử lý dấu ngoặc kép
      const cols = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
      const clean = (s) => (s || '').replace(/^"|"$/g, '').trim();

      if (cols.length < 4) throw new Error(`Dòng ${idx + 2}: thiếu cột (cần ít nhất 4).`);

      const correctIndex = parseInt(clean(cols[4]), 10);
      return {
        text:         clean(cols[0]),
        options:      [clean(cols[1]), clean(cols[2]), clean(cols[3])],
        correctIndex: isNaN(correctIndex) ? null : correctIndex,
        difficulty:   clean(cols[5]) || 'Medium',
        domain:       clean(cols[6]) || 'Mathematics',
        image:        null,
      };
    }).filter(q => q.text !== '');
  };

  const handlePickExcelFile = async () => {
    try {
      setParseError('');
      const result = await DocumentPicker.getDocumentAsync({
        // Chấp nhận CSV và Excel (xlsx đọc raw sẽ là binary, nên khuyến khích CSV)
        type: ['text/csv', 'text/comma-separated-values', 'application/vnd.ms-excel',
               'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      setExcelFile({ name: asset.name, uri: asset.uri });
      setIsParsing(true);
      setImportedQuestions([]);

      // Đọc nội dung file dưới dạng text
      const content = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const parsed = parseCSV(content);
      if (parsed.length === 0) throw new Error('Không tìm thấy câu hỏi hợp lệ trong file.');

      setImportedQuestions(parsed);
      setIsParsing(false);
    } catch (err) {
      setIsParsing(false);
      setParseError(err.message || 'Lỗi khi đọc file.');
    }
  };

  const handleClearExcel = () => {
    setExcelFile(null);
    setImportedQuestions([]);
    setParseError('');
  };

  // ==========================================
  // NAVIGATE SANG PART 2
  // ==========================================
  const handleNextStep = () => {
    let finalQuestions = [];

    if (activeTab === TAB_MANUAL) {
      // Kiểm tra có ít nhất 1 câu hỏi có nội dung
      const filled = questions.filter(q => q.text.trim() !== '');
      if (filled.length === 0) {
        Alert.alert('Chưa có câu hỏi', 'Vui lòng nhập ít nhất 1 câu hỏi.');
        return;
      }
      finalQuestions = filled;
    } else {
      if (importedQuestions.length === 0) {
        Alert.alert('Chưa import', 'Vui lòng chọn file CSV/Excel hợp lệ.');
        return;
      }
      finalQuestions = importedQuestions;
    }

    const examContent = {
      questions:  finalQuestions,
      domain:     finalQuestions[0]?.domain || 'General',
      sourceType: activeTab === TAB_MANUAL ? 'manual' : 'excel',
    };

    navigation.navigate('Tao_De_Thi_Part2', { examContent });
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1e3a8a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Practice Test</Text>
        <View style={styles.avatarMini} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        <Text style={styles.mainTitle}>Build Your Assessment</Text>
        <Text style={styles.subTitle}>Choose between precision manual entry or bulk importing via Excel/CSV.</Text>

        {/* ---- TAB SELECTOR ---- */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === TAB_MANUAL && styles.activeTab]}
            onPress={() => setActiveTab(TAB_MANUAL)}
          >
            <Text style={activeTab === TAB_MANUAL ? styles.activeTabText : styles.tabText}>
              Manual Entry
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === TAB_EXCEL && styles.activeTab]}
            onPress={() => setActiveTab(TAB_EXCEL)}
          >
            <Text style={activeTab === TAB_EXCEL ? styles.activeTabText : styles.tabText}>
              Import via Excel
            </Text>
          </TouchableOpacity>
        </View>

        {/* ================================================
            TAB 0: MANUAL ENTRY
        ================================================ */}
        {activeTab === TAB_MANUAL && (
          <>
            {/* Step 01 */}
            <View style={styles.card}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepLabel}>QUESTION {currentIndex + 1} OF {questions.length}</Text>
                <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.aiBadge}>
                  <Text style={styles.aiText}>☰ Question List</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.cardTitle}>Core Content</Text>
              <Text style={styles.inputLabel}>Question Statement</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Enter your question here..."
                multiline
                value={currentQ.text}
                onChangeText={(val) => updateCurrentQuestion('text', val)}
              />

              {/* Attach image */}
              {currentQ.image ? (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: currentQ.image }} style={styles.imagePreview} resizeMode="cover" />
                  <TouchableOpacity style={styles.removeImageBtn} onPress={() => updateCurrentQuestion('image', null)}>
                    <Ionicons name="close-circle" size={28} color="#ef4444" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.changeImageBtn} onPress={handlePickImage}>
                    <Ionicons name="pencil" size={14} color="white" />
                    <Text style={styles.changeImageText}>Đổi ảnh</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.uploadBox} onPress={handlePickImage}>
                  <Ionicons name="image-outline" size={30} color="#3b82f6" />
                  <Text style={styles.uploadText}>Attach Visual Reference</Text>
                  <Text style={styles.uploadSubText}>PNG, JPG up to 10MB</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Step 02: Responses */}
            <View style={styles.card}>
              <Text style={styles.stepLabel}>STEP 02</Text>
              <Text style={styles.cardTitle}>Response Parameters</Text>
              {['A', 'B', 'C'].map((label, index) => (
                <View key={index} style={styles.optionRow}>
                  <View style={[styles.optionLabel, currentQ.correctIndex === index && styles.optionLabelActive]}>
                    <Text style={currentQ.correctIndex === index ? styles.textWhite : null}>{label}</Text>
                  </View>
                  <TextInput
                    style={styles.optionInput}
                    placeholder="Enter option text..."
                    value={currentQ.options[index]}
                    onChangeText={(val) => updateOption(index, val)}
                  />
                  <TouchableOpacity onPress={() => updateCurrentQuestion('correctIndex', index)}>
                    <Ionicons
                      name={currentQ.correctIndex === index ? "checkmark-circle" : "ellipse-outline"}
                      size={24} color={currentQ.correctIndex === index ? "#3b82f6" : "#cbd5e1"}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Taxonomy */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Taxonomy</Text>
              <Text style={styles.inputLabel}>SUBJECT DOMAIN</Text>
              <TouchableOpacity style={styles.dropdown} onPress={() => setIsDomainDropdownVisible(true)}>
                <Text style={styles.dropdownValueText}>{currentQ.domain}</Text>
                <Ionicons name="chevron-down" size={20} color="#64748b" />
              </TouchableOpacity>

              <Text style={[styles.inputLabel, { marginTop: 15 }]}>DIFFICULTY GRADIENT</Text>
              <View style={styles.diffContainer}>
                {['Easy', 'Medium', 'Hard'].map(lvl => (
                  <TouchableOpacity
                    key={lvl}
                    style={[styles.diffBtn, currentQ.difficulty === lvl && styles.diffBtnActive]}
                    onPress={() => updateCurrentQuestion('difficulty', lvl)}
                  >
                    <Text style={currentQ.difficulty === lvl ? styles.textWhite : null}>{lvl}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}

        {/* ================================================
            TAB 1: IMPORT VIA EXCEL / CSV
        ================================================ */}
        {activeTab === TAB_EXCEL && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Import via Excel / CSV</Text>

            {/* Hướng dẫn định dạng */}
            <View style={styles.guideBox}>
              <Text style={styles.guideTitle}>📋 Định dạng file CSV mẫu:</Text>
              <Text style={styles.guideCode}>
                question,optionA,optionB,optionC,correctIndex,difficulty,domain{'\n'}
                "Câu hỏi 1","A","B","C",0,Easy,Mathematics{'\n'}
                "Câu hỏi 2","A","B","C",2,Hard,Physics
              </Text>
              <Text style={styles.guideNote}>
                • correctIndex: 0 = A, 1 = B, 2 = C{'\n'}
                • difficulty: Easy / Medium / Hard{'\n'}
                • File Excel (.xlsx) nên được lưu lại dưới dạng CSV trước khi import
              </Text>
            </View>

            {/* Nút chọn file */}
            {!excelFile ? (
              <TouchableOpacity style={styles.uploadBox} onPress={handlePickExcelFile}>
                <Ionicons name="document-attach-outline" size={36} color="#3b82f6" />
                <Text style={styles.uploadText}>Chọn file CSV / Excel</Text>
                <Text style={styles.uploadSubText}>.csv, .xls, .xlsx</Text>
              </TouchableOpacity>
            ) : (
              /* File đã chọn — hiển thị trạng thái */
              <View style={styles.fileSelectedBox}>
                <Ionicons name="document-text" size={30} color="#10b981" />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.fileNameText} numberOfLines={1}>{excelFile.name}</Text>
                  {isParsing && <Text style={styles.parsingText}>Đang phân tích...</Text>}
                  {!isParsing && importedQuestions.length > 0 && (
                    <Text style={styles.successText}>✅ {importedQuestions.length} câu hỏi đã import</Text>
                  )}
                  {parseError !== '' && (
                    <Text style={styles.errorText}>❌ {parseError}</Text>
                  )}
                </View>
                <TouchableOpacity onPress={handleClearExcel}>
                  <Ionicons name="close-circle" size={24} color="#ef4444" />
                </TouchableOpacity>
              </View>
            )}

            {/* Preview danh sách câu hỏi đã import */}
            {importedQuestions.length > 0 && (
              <View style={{ marginTop: 20 }}>
                <Text style={styles.inputLabel}>XEM TRƯỚC ({importedQuestions.length} CÂU)</Text>
                {importedQuestions.slice(0, 5).map((q, idx) => (
                  <View key={idx} style={styles.previewItem}>
                    <Text style={styles.previewIndex}>Q{idx + 1}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.previewText} numberOfLines={2}>{q.text}</Text>
                      <Text style={styles.previewMeta}>
                        ✓ {q.options[q.correctIndex] || '?'}  •  {q.difficulty}  •  {q.domain}
                      </Text>
                    </View>
                  </View>
                ))}
                {importedQuestions.length > 5 && (
                  <Text style={styles.moreText}>... và {importedQuestions.length - 5} câu nữa</Text>
                )}
              </View>
            )}
          </View>
        )}

        {/* ---- NÚT SAVE & CONTINUE ---- */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleNextStep}>
          <Text style={styles.saveBtnText}>Save & Continue →</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal: Question List (Manual) */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Questions List</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={questions}
              numColumns={5}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[
                    styles.qButton,
                    currentIndex === index && styles.qButtonActive,
                    item.text !== '' && currentIndex !== index && styles.qButtonFilled,
                  ]}
                  onPress={() => { setCurrentIndex(index); setIsModalVisible(false); }}
                >
                  <Text style={[styles.qButtonText, currentIndex === index && styles.textWhite]}>
                    {index + 1}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.addQBtn} onPress={handleAddNewQuestion}>
              <Ionicons name="add" size={20} color="white" />
              <Text style={styles.addQBtnText}>Add New Question</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal: Subject Domain Dropdown */}
      <Modal visible={isDomainDropdownVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsDomainDropdownVisible(false)}>
          <View style={styles.dropdownModal}>
            <Text style={styles.modalTitle}>Chọn môn học</Text>
            <FlatList
              data={SUBJECT_DOMAINS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.domainItem, currentQ.domain === item && styles.domainItemActive]}
                  onPress={() => { updateCurrentQuestion('domain', item); setIsDomainDropdownVisible(false); }}
                >
                  <Text style={[styles.domainItemText, currentQ.domain === item && styles.domainItemTextActive]}>{item}</Text>
                  {currentQ.domain === item && <Ionicons name="checkmark" size={18} color="#3b82f6" />}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <NavItem icon="grid" label="Dashboard" active />
        <NavItem icon="book-outline" label="Classes" />
        <NavItem icon="time-outline" label="History" />
        <NavItem icon="person-outline" label="Profile" />
      </View>
    </SafeAreaView>
  );
}

const NavItem = ({ icon, label, active }) => (
  <TouchableOpacity style={styles.navItem}>
    <Ionicons name={icon} size={22} color={active ? "#3b82f6" : "#64748b"} />
    <Text style={[styles.navText, active && styles.navTextActive]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e3a8a' },
  avatarMini: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#333' },
  scrollBody: { padding: 20 },
  mainTitle: { fontSize: 28, fontWeight: 'bold', color: '#0f172a' },
  subTitle: { color: '#64748b', marginVertical: 10, lineHeight: 20 },

  tabContainer: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 12, padding: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeTab: { backgroundColor: 'white', elevation: 2 },
  activeTabText: { fontWeight: 'bold', color: '#0f172a' },
  tabText: { color: '#64748b' },

  card: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 20, elevation: 2 },
  stepHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  stepLabel: { fontSize: 12, fontWeight: 'bold', color: '#64748b' },
  aiBadge: { backgroundColor: '#f0f7ff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  aiText: { fontSize: 12, color: '#3b82f6', fontWeight: 'bold' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  inputLabel: { fontSize: 12, fontWeight: 'bold', color: '#64748b', marginBottom: 8 },
  textArea: { backgroundColor: '#f1f5f9', borderRadius: 12, padding: 15, height: 100, textAlignVertical: 'top' },

  uploadBox: { borderStyle: 'dashed', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 15, padding: 30, alignItems: 'center', marginTop: 15 },
  uploadText: { fontWeight: 'bold', marginTop: 10 },
  uploadSubText: { fontSize: 10, color: '#94a3b8', marginTop: 4 },

  imagePreviewContainer: { marginTop: 15, borderRadius: 15, overflow: 'hidden', position: 'relative' },
  imagePreview: { width: '100%', height: 200, borderRadius: 15 },
  removeImageBtn: { position: 'absolute', top: 8, right: 8, backgroundColor: 'white', borderRadius: 14 },
  changeImageBtn: { position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.55)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  changeImageText: { color: 'white', fontSize: 12, marginLeft: 4 },

  optionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  optionLabel: { width: 35, height: 35, borderRadius: 10, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  optionLabelActive: { backgroundColor: '#3b82f6' },
  textWhite: { color: 'white', fontWeight: 'bold' },
  optionInput: { flex: 1, backgroundColor: '#f8fafc', padding: 10, borderRadius: 8, marginRight: 10 },

  dropdown: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f1f5f9', padding: 15, borderRadius: 12 },
  dropdownValueText: { fontSize: 15, color: '#0f172a' },
  dropdownModal: { backgroundColor: 'white', borderRadius: 20, padding: 20, width: '90%', maxHeight: '60%' },
  domainItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8, borderRadius: 8 },
  domainItemActive: { backgroundColor: '#eff6ff' },
  domainItemText: { fontSize: 15, color: '#0f172a' },
  domainItemTextActive: { color: '#3b82f6', fontWeight: 'bold' },
  separator: { height: 1, backgroundColor: '#f1f5f9' },

  diffContainer: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 8, padding: 4 },
  diffBtn: { flex: 1, padding: 10, alignItems: 'center', borderRadius: 6 },
  diffBtnActive: { backgroundColor: '#3b82f6' },

  saveBtn: { backgroundColor: '#3b82f6', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10, marginBottom: 30 },
  saveBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  // Excel Import
  guideBox: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 14, marginBottom: 16, borderLeftWidth: 3, borderLeftColor: '#3b82f6' },
  guideTitle: { fontWeight: 'bold', color: '#1e3a8a', marginBottom: 6 },
  guideCode: { fontFamily: 'monospace', fontSize: 11, color: '#334155', backgroundColor: '#e2e8f0', padding: 8, borderRadius: 6, marginBottom: 8 },
  guideNote: { fontSize: 11, color: '#64748b', lineHeight: 18 },
  fileSelectedBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0fdf4', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#bbf7d0', marginTop: 12 },
  fileNameText: { fontWeight: 'bold', color: '#0f172a', fontSize: 13 },
  parsingText: { color: '#64748b', fontSize: 12, marginTop: 2 },
  successText: { color: '#16a34a', fontSize: 12, marginTop: 2, fontWeight: 'bold' },
  errorText: { color: '#dc2626', fontSize: 12, marginTop: 2 },
  previewItem: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#f8fafc', padding: 10, borderRadius: 10, marginBottom: 8 },
  previewIndex: { fontWeight: 'bold', color: '#3b82f6', width: 28, fontSize: 13 },
  previewText: { fontSize: 13, color: '#0f172a' },
  previewMeta: { fontSize: 11, color: '#64748b', marginTop: 3 },
  moreText: { textAlign: 'center', color: '#94a3b8', fontSize: 12, marginTop: 4 },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', backgroundColor: 'white', borderRadius: 20, padding: 20, maxHeight: '70%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 15 },
  qButton: { width: 45, height: 45, borderRadius: 10, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', margin: 8 },
  qButtonActive: { backgroundColor: '#3b82f6' },
  qButtonFilled: { backgroundColor: '#dbeafe', borderWidth: 1, borderColor: '#bfdbfe' },
  qButtonText: { fontSize: 14, fontWeight: 'bold', color: '#64748b' },
  addQBtn: { flexDirection: 'row', backgroundColor: '#10b981', padding: 15, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  addQBtnText: { color: 'white', fontWeight: 'bold', marginLeft: 8 },

  bottomNav: { flexDirection: 'row', backgroundColor: 'white', paddingVertical: 12, borderTopWidth: 1, borderColor: '#f1f5f9' },
  navItem: { flex: 1, alignItems: 'center' },
  navText: { fontSize: 10, color: '#64748b', marginTop: 4 },
  navTextActive: { color: '#3b82f6', fontWeight: 'bold' },
});