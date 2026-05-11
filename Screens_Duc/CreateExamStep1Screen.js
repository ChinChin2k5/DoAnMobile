import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ImageBackground, SafeAreaView, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';

export default function CreateExamStep1Screen({ navigation }) {
  const { userName } = useContext(UserContext);
  const [examTitle, setExamTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 
    'History', 'Geography', 'Computer Science', 'Literature', 'Other'
  ];

  const handleNext = () => {
    if (!examTitle.trim()) {
      const msg = Platform.OS === 'web' 
        ? window.alert('Please enter exam title!')
        : Alert.alert('Error', 'Please enter exam title!');
      return;
    }
    if (!subject.trim()) {
      const msg = Platform.OS === 'web'
        ? window.alert('Please select a subject!')
        : Alert.alert('Error', 'Please select a subject!');
      return;
    }

    const stepData = {
      title: examTitle.trim(),
      subject: subject,
      difficulty: difficulty,
      createdBy: userName,
      createdAt: new Date().toISOString()
    };
    navigation.navigate('CreateExamStep2', { stepData });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Progress Bar & Header */}
        <View style={styles.headerSection}>
          <Text style={styles.stepText}>STEP 1 OF 3</Text>
          <Text style={styles.screenTitle}>Basic Information</Text>
        </View>

        {/* Hero Image */}
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1633613286991-611fe299c4be?q=80&w=600' }} 
          style={styles.heroImage}
          imageStyle={{ borderRadius: 32 }}
        >
          <LinearGradient
            colors={['rgba(11, 28, 48, 0.4)', 'rgba(11, 28, 48, 0)']}
            style={styles.heroGradient}
          >
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroSub}>EXAM COVER</Text>
              <Text style={styles.heroTitle}>Upload your exam image</Text>
            </View>
          </LinearGradient>
        </ImageBackground>

        {/* Form */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>EXAM TITLE *</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g., Advanced Quantum Mechanics Finals" 
              placeholderTextColor="rgba(114, 118, 135, 0.6)"
              value={examTitle}
              onChangeText={setExamTitle}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>SUBJECT *</Text>
            <TouchableOpacity 
              style={styles.dropdownSelect}
              onPress={() => setShowSubjectPicker(!showSubjectPicker)}
            >
              <Text style={[styles.dropdownText, !subject && { color: 'rgba(114, 118, 135, 0.6)' }]}>
                {subject || 'Select a subject'}
              </Text>
              <Ionicons name={showSubjectPicker ? "chevron-up" : "chevron-down"} size={16} color="#727687" />
            </TouchableOpacity>
            {showSubjectPicker && (
              <View style={styles.dropdownList}>
                {subjects.map((subj) => (
                  <TouchableOpacity
                    key={subj}
                    style={[styles.dropdownItem, subject === subj && styles.dropdownItemActive]}
                    onPress={() => {
                      setSubject(subj);
                      setShowSubjectPicker(false);
                    }}
                  >
                    <Text style={[styles.dropdownItemText, subject === subj && styles.dropdownItemTextActive]}>
                      {subj}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>DIFFICULTY</Text>
            <View style={styles.toggleGroup}>
              {['Easy', 'Medium', 'Hard'].map((level) => (
                <TouchableOpacity 
                  key={level}
                  style={[styles.toggleBtn, difficulty === level && styles.toggleBtnActive]}
                  onPress={() => setDifficulty(level)}
                >
                  <Text style={[styles.toggleText, difficulty === level && styles.toggleTextActive]}>{level}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Note */}
        <View style={styles.noteBox}>
          <Ionicons name="information-circle" size={20} color="#4345D1" style={{ marginTop: 2 }}/>
          <View style={styles.noteTextContainer}>
            <Text style={styles.noteTitle}>Note</Text>
            <Text style={styles.noteDesc}>Ensure exam title and subject match your current curriculum for accurate system categorization.</Text>
          </View>
        </View>

        {/* Next Button */}
        <TouchableOpacity onPress={handleNext}>
          <LinearGradient colors={['#0050CB', '#0066FF']} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
          <Text style={styles.backButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FF' },
  scrollContent: { padding: 24, paddingBottom: 60 },
  headerSection: { marginBottom: 32 },
  stepText: { fontWeight: '400', fontSize: 12, color: '#0050CB', letterSpacing: 0.6, marginBottom: 4 },
  screenTitle: { fontWeight: '700', fontSize: 32, color: '#0B1C30', letterSpacing: -0.8 },
  heroImage: { height: 192, marginBottom: 32, borderRadius: 32 },
  heroGradient: { flex: 1, borderRadius: 32, justifyContent: 'flex-end', padding: 16 },
  heroSub: { fontSize: 12, color: '#FFFFFF', letterSpacing: 1.2, opacity: 0.8 },
  heroTitle: { fontWeight: '700', fontSize: 16, color: '#FFFFFF' },
  formSection: { gap: 24, marginBottom: 24 },
  inputGroup: { gap: 8 },
  label: { fontWeight: '600', fontSize: 12, color: '#424656', letterSpacing: 0.6 },
  input: { backgroundColor: '#EFF4FF', borderRadius: 32, padding: 18, fontSize: 16, color: '#0B1C30' },
  dropdownSelect: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#EFF4FF', borderRadius: 32, padding: 18 },
  dropdownText: { fontSize: 16, color: '#0B1C30' },
  dropdownList: { backgroundColor: '#FFFFFF', borderRadius: 16, marginTop: 8, borderWidth: 1, borderColor: '#E5EEFF', overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  dropdownItem: { paddingVertical: 16, paddingHorizontal: 18, borderBottomWidth: 1, borderBottomColor: '#F0F4FF' },
  dropdownItemActive: { backgroundColor: '#EFF4FF' },
  dropdownItemText: { fontSize: 16, color: '#424656' },
  dropdownItemTextActive: { fontWeight: '600', color: '#0050CB' },
  toggleGroup: { flexDirection: 'row', backgroundColor: '#EFF4FF', borderRadius: 48, padding: 4 },
  toggleBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 32 },
  toggleBtnActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  toggleText: { fontWeight: '500', fontSize: 14, color: '#424656' },
  toggleTextActive: { fontWeight: '700', color: '#0050CB' },
  noteBox: { flexDirection: 'row', backgroundColor: 'rgba(239, 244, 255, 0.5)', borderLeftWidth: 4, borderLeftColor: '#4345D1', borderRadius: 16, padding: 16, marginBottom: 32, gap: 12 },
  noteTitle: { fontWeight: '500', fontSize: 14, color: '#0B1C30' },
  noteDesc: { fontSize: 14, color: '#424656', lineHeight: 22 },
  noteTextContainer: { flex: 1 },
  nextButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 20, borderRadius: 9999, gap: 8 },
  nextButtonText: { fontWeight: '700', fontSize: 18, color: '#FFFFFF' },
  backButtonContainer: { marginTop: 16, paddingVertical: 16, borderRadius: 9999, backgroundColor: '#DCE9FF', alignItems: 'center' },
  backButtonText: { fontWeight: '700', fontSize: 16, color: '#003FA4' }
});