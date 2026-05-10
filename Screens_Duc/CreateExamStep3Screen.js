import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch, SafeAreaView, Alert, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { UserContext } from '../context/UserContext';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CreateExamStep3Screen({ navigation, route }) {
  const { userRole, classCode, userName } = useContext(UserContext);
  const { examData } = route?.params || {};

  const [isShuffle, setIsShuffle] = useState(true);
  const [shuffleAnswers, setShuffleAnswers] = useState(false);
  const [antiCheating, setAntiCheating] = useState(false);
  const [allowRetake, setAllowRetake] = useState(false);
  const [duration, setDuration] = useState(45);
  const [selectedClasses, setSelectedClasses] = useState(['A1']);
  const [isLoading, setIsLoading] = useState(false);

  const classes = [
    { id: 'A1', name: 'Class A1', students: 32, grade: 10 },
    { id: 'A2', name: 'Class A2', students: 28, grade: 10 },
    { id: 'B1', name: 'Class B1', students: 40, grade: 11 },
    { id: 'C1', name: 'Class C1', students: 35, grade: 12 },
  ];

  const handlePublish = async () => {
    if (!duration || duration < 5) {
      const msg = Platform.OS === 'web'
        ? window.alert('Duration must be at least 5 minutes!')
        : Alert.alert('Error', 'Duration must be at least 5 minutes!');
      return;
    }

    if (selectedClasses.length === 0) {
      const msg = Platform.OS === 'web'
        ? window.alert('Please select at least one class!')
        : Alert.alert('Error', 'Please select at least one class!');
      return;
    }

    setIsLoading(true);
    try {
      const finalExamData = {
        ...examData,
        duration: duration,
        config: {
          shuffleQuestions: isShuffle,
          shuffleAnswers: shuffleAnswers,
          antiCheating: antiCheating,
          allowRetake: allowRetake
        },
        assignedClasses: selectedClasses,
        creatorName: userName,
        creatorRole: userRole,
        createdAt: serverTimestamp(),
        status: 'active',
        totalAttempts: 0
      };

      const docRef = await addDoc(collection(db, 'exams'), finalExamData);

      const successMsg = userRole === 'teacher'
        ? 'Exam published successfully to selected classes!'
        : 'Exam created successfully!';

      if (Platform.OS === 'web') {
        window.alert(successMsg);
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs', params: { screen: 'Dashboard' } }]
        });
      } else {
        Alert.alert('Success', successMsg, [
          { text: 'OK', onPress: () => navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs', params: { screen: 'Dashboard' } }]
          }) }
        ]);
      }
    } catch (error) {
      console.error('Error publishing exam:', error);
      const errorMsg = error.message || 'Failed to publish exam. Please try again.';
      if (Platform.OS === 'web') {
        window.alert('Error: ' + errorMsg);
      } else {
        Alert.alert('Error', errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleClass = (classId) => {
    setSelectedClasses(prev =>
      prev.includes(classId)
        ? prev.filter(id => id !== classId)
        : [...prev, classId]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.headerSection}>
          <Text style={styles.stepText}>STEP 3 OF 3</Text>
          <Text style={styles.screenTitle}>Settings & Publish</Text>
          <Text style={styles.screenDesc}>Configure exam rules and assign to classes.</Text>
        </View>

        {/* Duration Settings */}
        <View style={styles.settingCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="time" size={20} color="#0050CB" />
            <Text style={styles.cardTitle}>Time & Configuration</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>DURATION (MINUTES) *</Text>
            <View style={styles.durationRow}>
              <TextInput 
                style={styles.durationInput} 
                placeholder="45" 
                keyboardType="numeric"
                value={duration.toString()}
                onChangeText={(val) => {
                  const num = parseInt(val) || 0;
                  setDuration(Math.min(Math.max(num, 5), 480));
                }}
              />
              <Text style={styles.durationUnit}>minutes</Text>
            </View>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={5}
              maximumValue={480}
              step={5}
              value={duration}
              onValueChange={setDuration}
              minimumTrackTintColor="#0050CB"
              maximumTrackTintColor="#DCE9FF"
              thumbTintColor="#0050CB"
            />
          </View>
        </View>

        {/* Exam Rules */}
        <View style={styles.settingCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="shield-checkmark" size={20} color="#0050CB" />
            <Text style={styles.cardTitle}>Exam Rules (Advanced)</Text>
          </View>
          
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleTitle}>Shuffle Questions</Text>
              <Text style={styles.toggleDesc}>Randomize question order per student</Text>
            </View>
            <Switch
              trackColor={{ false: "#C2C6D8", true: "#0050CB" }}
              thumbColor={"#FFFFFF"}
              onValueChange={setIsShuffle}
              value={isShuffle}
            />
          </View>

          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleTitle}>Shuffle Answers</Text>
              <Text style={styles.toggleDesc}>Randomize answer positions</Text>
            </View>
            <Switch
              trackColor={{ false: "#C2C6D8", true: "#0050CB" }}
              thumbColor={"#FFFFFF"}
              onValueChange={setShuffleAnswers}
              value={shuffleAnswers}
            />
          </View>

          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleTitle}>Anti-Cheating Mode</Text>
              <Text style={styles.toggleDesc}>Prevent tab switching and screenshots</Text>
            </View>
            <Switch
              trackColor={{ false: "#C2C6D8", true: "#0050CB" }}
              thumbColor={"#FFFFFF"}
              onValueChange={setAntiCheating}
              value={antiCheating}
            />
          </View>

          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleTitle}>Allow Retake</Text>
              <Text style={styles.toggleDesc}>Students can attempt multiple times</Text>
            </View>
            <Switch
              trackColor={{ false: "#C2C6D8", true: "#0050CB" }}
              thumbColor={"#FFFFFF"}
              onValueChange={setAllowRetake}
              value={allowRetake}
            />
          </View>
        </View>

        {/* Assign Class */}
        <View style={styles.settingCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="people" size={20} color="#0050CB" />
            <Text style={styles.cardTitle}>Assign to Classes *</Text>
          </View>
          
          <View style={styles.classList}>
            {classes.map((cls) => (
              <TouchableOpacity 
                key={cls.id} 
                style={[styles.classItem, selectedClasses.includes(cls.id) && styles.classItemActive]}
                onPress={() => toggleClass(cls.id)}
              >
                <View style={[styles.checkbox, selectedClasses.includes(cls.id) && styles.checkboxActive]}>
                  {selectedClasses.includes(cls.id) && (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.className}>{cls.name}</Text>
                  <Text style={styles.classMeta}>{cls.students} students • Grade {cls.grade}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Ionicons name="document-text" size={16} color="#0050CB" />
            <Text style={styles.summaryText}>{examData?.totalQuestions || 0} Questions</Text>
          </View>
          <View style={styles.summaryRow}>
            <Ionicons name="time" size={16} color="#0050CB" />
            <Text style={styles.summaryText}>{duration} minutes</Text>
          </View>
          <View style={styles.summaryRow}>
            <Ionicons name="people" size={16} color="#0050CB" />
            <Text style={styles.summaryText}>{selectedClasses.length} class(es)</Text>
          </View>
        </View>

        {/* Spacer for Action Bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Bar */}
      <View style={styles.floatingBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} disabled={isLoading}>
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1 }} onPress={handlePublish} disabled={isLoading}>
          <LinearGradient colors={['#0050CB', '#0066FF']} style={styles.nextBtn}>
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Text style={styles.nextBtnText}>Publish Exam</Text>
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FF' },
  scrollContent: { padding: 24, paddingTop: 40 },
  headerSection: { marginBottom: 32, gap: 8 },
  stepText: { fontWeight: '400', fontSize: 12, color: '#0050CB', letterSpacing: 2.4 },
  screenTitle: { fontWeight: '700', fontSize: 32, color: '#0B1C30', letterSpacing: -0.8 },
  screenDesc: { fontSize: 16, color: '#424656', lineHeight: 24 },
  settingCard: { backgroundColor: '#FFFFFF', borderRadius: 32, padding: 32, marginBottom: 24, gap: 24, borderWidth: 1, borderColor: '#E5EEFF' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardTitle: { fontWeight: '700', fontSize: 18, color: '#0B1C30', flex: 1 },
  inputGroup: { gap: 12 },
  label: { fontWeight: '600', fontSize: 12, color: '#424656', letterSpacing: 0.6 },
  input: { backgroundColor: '#EFF4FF', borderRadius: 16, padding: 18, fontSize: 16, borderWidth: 1, borderColor: '#DCE9FF' },
  durationRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  durationInput: { flex: 1, backgroundColor: '#EFF4FF', borderRadius: 16, padding: 16, fontSize: 18, fontWeight: 'bold', color: '#0050CB', borderWidth: 1, borderColor: '#DCE9FF' },
  durationUnit: { fontSize: 14, color: '#424656', fontWeight: '500' },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#EFF4FF', padding: 20, borderRadius: 16 },
  toggleTitle: { fontWeight: '700', fontSize: 16, color: '#0B1C30', marginBottom: 4 },
  toggleDesc: { fontSize: 12, color: '#727687', lineHeight: 18 },
  classList: { gap: 12 },
  classItem: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#EFF4FF', borderRadius: 16, gap: 16, borderWidth: 2, borderColor: 'transparent' },
  classItemActive: { borderColor: '#0050CB', backgroundColor: '#FFFFFF' },
  checkbox: { width: 24, height: 24, borderRadius: 8, borderWidth: 2, borderColor: '#DCE9FF', justifyContent: 'center', alignItems: 'center', backgroundColor: '#EFF4FF' },
  checkboxActive: { backgroundColor: '#0050CB', borderColor: '#0050CB' },
  className: { fontWeight: '600', fontSize: 16, color: '#0B1C30', marginBottom: 2 },
  classMeta: { fontSize: 12, color: '#727687' },
  summaryCard: { backgroundColor: '#F0F7FF', borderRadius: 20, padding: 24, gap: 12, borderLeftWidth: 4, borderLeftColor: '#0050CB' },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  summaryText: { fontWeight: '500', fontSize: 14, color: '#1E3A8A' },
  floatingBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: 24, flexDirection: 'row', gap: 16, borderTopWidth: 1, borderTopColor: '#E5EEFF' },
  backBtn: { backgroundColor: '#DCE9FF', paddingVertical: 20, paddingHorizontal: 32, borderRadius: 9999, justifyContent: 'center', alignItems: 'center' },
  backBtnText: { fontWeight: '700', fontSize: 16, color: '#003FA4' },
  nextBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 20, borderRadius: 9999, gap: 12 },
  nextBtnText: { fontWeight: '700', fontSize: 16, color: '#FFFFFF' }
});