import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Modal, TextInput, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';

const defaultQuestion = {
  text: '',
  options: ['', '', '', ''],
  correctIndex: null,
  difficulty: 'Medium',
  image: null,
  domain: 'General',
};

export default function CreateExamStep2Screen({ navigation, route }) {
  const { userName } = useContext(UserContext);
  const { stepData } = route?.params || {};
  
  const [questions, setQuestions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingQ, setEditingQ] = useState(null);
  const [editingIndex, setEditingIndex] = useState(-1);

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

  const handleDeleteQuestion = (index) => {
    if (Platform.OS === 'web') {
      if (window.confirm(`Delete Question ${index + 1}?`)) {
        setQuestions(questions.filter((_, i) => i !== index));
      }
    } else {
      Alert.alert('Delete Question', `Are you sure you want to delete Question ${index + 1}?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => setQuestions(questions.filter((_, i) => i !== index)) }
      ]);
    }
  };

  const handleUpdateOption = (text, optIndex) => {
    const newOptions = [...editingQ.options];
    newOptions[optIndex] = text;
    setEditingQ({ ...editingQ, options: newOptions });
  };

  const handleSaveQuestion = () => {
    if (!editingQ.text.trim()) {
      const msg = Platform.OS === 'web'
        ? window.alert('Please enter question text!')
        : Alert.alert('Error', 'Please enter question text!');
      return;
    }
    if (editingQ.correctIndex === null) {
      const msg = Platform.OS === 'web'
        ? window.alert('Please select correct answer!')
        : Alert.alert('Error', 'Please select correct answer!');
      return;
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

  const handleNext = () => {
    if (questions.length === 0) {
      const msg = Platform.OS === 'web'
        ? window.alert('Please add at least one question!')
        : Alert.alert('Error', 'Please add at least one question!');
      return;
    }

    const examData = {
      ...stepData,
      questions: questions,
      totalQuestions: questions.length,
      createdAt: new Date().toISOString(),
      creatorName: userName
    };
    navigation.navigate('CreateExamStep3', { examData });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <Text style={styles.stepText}>STEP 2 OF 3</Text>
          <Text style={styles.screenTitle}>Add Questions</Text>
          <Text style={styles.screenDesc}>Build your question bank ({questions.length} added)</Text>
        </View>

        {/* Quick Action Grid */}
        <View style={styles.gridContainer}>
          <TouchableOpacity style={styles.gridCard} onPress={handleAddNewQuestion}>
            <View style={[styles.iconBg, { backgroundColor: '#DAE1FF' }]}>
              <Ionicons name="pencil" size={24} color="#001849"/>
            </View>
            <Text style={styles.cardTitle}>Add Manually</Text>
            <Text style={styles.cardDesc}>Create new questions from scratch with various formats.</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.gridCard}>
            <View style={[styles.iconBg, { backgroundColor: '#CFE5FF' }]}>
              <Ionicons name="library" size={24} color="#004A79"/>
            </View>
            <Text style={styles.cardTitle}>From Bank</Text>
            <Text style={styles.cardDesc}>Reuse verified questions from your question bank.</Text>
          </TouchableOpacity>
        </View>

        {/* Questions List */}
        {questions.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="add" size={24} color="#727687" />
            </View>
            <Text style={styles.emptyText}>No questions added yet. Click above to add your first question.</Text>
          </View>
        ) : (
          <View style={styles.questionsList}>
            {questions.map((q, idx) => (
              <View key={idx} style={styles.questionItem}>
                <View style={styles.qNum}>
                  <Text style={styles.qNumText}>{idx + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.qText} numberOfLines={2}>{q.text}</Text>
                  <Text style={styles.qMeta}>Answer: Option {q.correctIndex + 1}</Text>
                </View>
                <View style={styles.qActions}>
                  <TouchableOpacity onPress={() => handleEditQuestion(idx)}>
                    <Ionicons name="pencil" size={18} color="#0050CB" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteQuestion(idx)} style={{ marginLeft: 12 }}>
                    <Ionicons name="trash" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Spacer for Floating Bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Bar */}
      <View style={styles.floatingBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} style={{ flex: 1 }}>
          <LinearGradient colors={['#0050CB', '#0066FF']} style={styles.nextBtn}>
            <Text style={styles.nextBtnText}>Continue</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Question Editor Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <SafeAreaView style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#0B1C30" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {editingIndex === -1 ? 'New Question' : `Edit Question ${editingIndex + 1}`}
              </Text>
              <View style={{ width: 24 }} />
            </View>

            {editingQ && (
              <>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Question Text *</Text>
                  <TextInput
                    style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                    multiline
                    value={editingQ.text}
                    onChangeText={(t) => setEditingQ({ ...editingQ, text: t })}
                    placeholder="Enter question..."
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Answer Options (Select correct answer)</Text>
                  {editingQ.options.map((opt, i) => (
                    <View key={i} style={styles.optionRow}>
                      <TouchableOpacity
                        style={styles.checkBox}
                        onPress={() => setEditingQ({ ...editingQ, correctIndex: i })}
                      >
                        <Ionicons
                          name={editingQ.correctIndex === i ? "checkmark-circle" : "ellipse-outline"}
                          size={24}
                          color={editingQ.correctIndex === i ? "#10B981" : "#CBD5E1"}
                        />
                      </TouchableOpacity>
                      <TextInput
                        style={[styles.input, { flex: 1, marginBottom: 0 }]}
                        value={opt}
                        onChangeText={(t) => handleUpdateOption(t, i)}
                        placeholder={`Option ${i + 1}`}
                      />
                    </View>
                  ))}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Difficulty</Text>
                  <View style={styles.difficultyGroup}>
                    {['Easy', 'Medium', 'Hard'].map((level) => (
                      <TouchableOpacity
                        key={level}
                        style={[styles.diffBtn, editingQ.difficulty === level && styles.diffBtnActive]}
                        onPress={() => setEditingQ({ ...editingQ, difficulty: level })}
                      >
                        <Text style={[styles.diffText, editingQ.difficulty === level && styles.diffTextActive]}>
                          {level}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, styles.modalBtnCancel]} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.modalBtnSave]} onPress={handleSaveQuestion}>
                <Text style={[styles.modalBtnText, { color: 'white' }]}>Save Question</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FF' },
  scrollContent: { padding: 24, paddingTop: 40 },
  headerSection: { marginBottom: 32 },
  stepText: { fontWeight: '400', fontSize: 12, color: '#0050CB', letterSpacing: 1.2 },
  screenTitle: { fontWeight: '800', fontSize: 30, color: '#0B1C30', letterSpacing: -0.75 },
  screenDesc: { fontSize: 14, color: '#424656', marginTop: 8, lineHeight: 22 },
  gridContainer: { gap: 24, marginBottom: 32 },
  gridCard: { backgroundColor: '#FFFFFF', borderRadius: 32, padding: 32, borderWidth: 1, borderColor: 'rgba(194, 198, 216, 0.1)', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, elevation: 2 },
  iconBg: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontWeight: '700', fontSize: 20, color: '#0B1C30', marginBottom: 8 },
  cardDesc: { fontSize: 14, color: '#424656', lineHeight: 22 },
  emptyState: { borderStyle: 'dashed', borderWidth: 2, borderColor: 'rgba(194, 198, 216, 0.3)', borderRadius: 32, padding: 48, alignItems: 'center' },
  emptyIcon: { width: 64, height: 64, backgroundColor: '#E5EEFF', borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  emptyText: { textAlign: 'center', color: '#727687', fontSize: 16, lineHeight: 24 },
  questionsList: { gap: 12, marginBottom: 20 },
  questionItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5EEFF' },
  qNum: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#EFF4FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  qNumText: { fontWeight: '700', fontSize: 14, color: '#0050CB' },
  qText: { fontWeight: '600', fontSize: 14, color: '#0B1C30', marginBottom: 4 },
  qMeta: { fontSize: 12, color: '#727687' },
  qActions: { flexDirection: 'row', marginLeft: 12 },
  floatingBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: 24, flexDirection: 'row', gap: 16, borderTopWidth: 1, borderTopColor: '#E5EEFF' },
  backBtn: { backgroundColor: '#DCE9FF', paddingVertical: 20, paddingHorizontal: 32, borderRadius: 9999, justifyContent: 'center', alignItems: 'center' },
  backBtnText: { fontWeight: '700', fontSize: 16, color: '#003FA4' },
  nextBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 20, borderRadius: 9999, gap: 12 },
  nextBtnText: { fontWeight: '700', fontSize: 16, color: '#FFFFFF' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { paddingBottom: 80, padding: 20, backgroundColor: 'white', flexGrow: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingTop: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#0B1C30' },
  formGroup: { marginBottom: 24 },
  label: { fontWeight: '600', fontSize: 12, color: '#424656', letterSpacing: 0.6, marginBottom: 8 },
  input: { backgroundColor: '#EFF4FF', borderRadius: 12, padding: 12, fontSize: 14, color: '#0B1C30', borderWidth: 1, borderColor: '#DCE9FF' },
  optionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  checkBox: { marginRight: 12 },
  difficultyGroup: { flexDirection: 'row', gap: 8 },
  diffBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', backgroundColor: '#EFF4FF', borderRadius: 12, borderWidth: 1, borderColor: '#DCE9FF' },
  diffBtnActive: { backgroundColor: '#0050CB', borderColor: '#0050CB' },
  diffText: { fontWeight: '500', fontSize: 12, color: '#424656' },
  diffTextActive: { color: '#FFFFFF' },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  modalBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  modalBtnCancel: { backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#DCE9FF' },
  modalBtnSave: { backgroundColor: '#0050CB' },
  modalBtnText: { fontWeight: '700', fontSize: 14, color: '#424656' }
});