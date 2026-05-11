// screens/CreateClass2Screen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  SafeAreaView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

export default function CreateClass2Screen({ navigation, route }) {
  const [isLoading, setIsLoading] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [classData, setClassData] = useState(null);
  const [teacherName, setTeacherName] = useState('');

  useEffect(() => {
    const initializeClass = async () => {
      try {
        // Get class data from route params
        const data = route?.params?.classData;
        setClassData(data);
        
        // Fetch teacher name
        await fetchTeacherName();
        
        // Generate class code
        const code = generateClassCode();
        setClassCode(code);

        // Save to Firestore
        await saveClassToFirestore(data, code);
      } catch (error) {
        Alert.alert('Error', 'Failed to create classroom: ' + error.message);
      }
    };

    initializeClass();
  }, []);

  const fetchTeacherName = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      // Try to get teacher name from Firestore users collection
      const q = query(
        collection(db, 'users'),
        where('uid', '==', user.uid)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        setTeacherName(userData.fullName || userData.name || user.email || '');
      } else {
        setTeacherName(user.displayName || user.email || '');
      }
    } catch (error) {
      console.error('Error fetching teacher name:', error);
    }
  };

  const generateClassCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };

  const saveClassToFirestore = async (data, code) => {
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const docRef = await addDoc(collection(db, 'classes'), {
        className: data?.className || 'Untitled Class',
        themeColor: data?.themeColor || '#0050CB',
        level: data?.level || 'High School - Year 12',
        description: data?.description || '',
        classCode: code,
        teacherId: user.uid,
        teacherEmail: user.email,
        teacherName: teacherName || user.displayName || user.email || 'Unknown Teacher',
        createdAt: serverTimestamp(),
        students: [],
        totalStudents: 0,
      });

      setIsLoading(false);
      
      // Navigate to ClassDashboard after successful creation
      navigation.navigate('ClassDashboard', { classId: docRef.id });
    } catch (error) {
      setIsLoading(false);
      console.error('Error saving class:', error);
      Alert.alert('Error', 'Could not save class to database');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Navigation Shell */}
      <View style={styles.topAppBar}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#64748B" />
        </TouchableOpacity>
        <Text style={styles.logoText}>Atoza</Text>
        <View style={{ width: 32 }} /> {/* Placeholder for right side */}
      </View>

      <View style={styles.contentSection}>
        {/* Header Group */}
        <View style={styles.headerGroup}>
          <Text style={styles.mainHeading}>The Classroom is Open.</Text>
          <Text style={styles.subHeading}>
            Your digital learning environment is configured and ready for students. Welcome to a new era of cognitive clarity.
          </Text>
        </View>

        {/* Class Detail Card */}
        <View style={styles.detailCard}>
          <Text style={styles.classNameLabel}>CLASSROOM NAME</Text>
          <Text style={styles.classNameText}>{classData?.className || 'Advanced Cognitive Psychology 101'}</Text>
          
          <View style={styles.codeBox}>
            <View style={styles.codeLeft}>
              <Text style={styles.codeLabel}>MÃ LỚP HỌC</Text>
              <Text style={styles.codeText}>{classCode || 'AXYZ9'}</Text>
            </View>
            <TouchableOpacity style={styles.copyBtn}>
              <Ionicons name="copy-outline" size={20} color="#0050CB" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Cluster */}
        <View style={styles.actionCluster}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#0050CB" />
          ) : (
            <>
              <TouchableOpacity style={{ width: '100%' }} onPress={() => navigation.navigate('MainTabsAdmin', { screen: 'AdminHome' })}>
                <LinearGradient colors={['#0050CB', '#0066FF']} style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Go to Class Dashboard</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryLink} onPress={() => navigation.navigate('MainTabsAdmin', { screen: 'AdminHome' })}>
                <Ionicons name="arrow-back" size={16} color="#0050CB" />
                <Text style={styles.secondaryLinkText}>Quay lại trang chủ</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FF' },
  topAppBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 12, backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 10 },
  iconButton: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  logoText: { fontWeight: '700', fontSize: 20, color: '#1D4ED8', letterSpacing: -0.5 },
  
  contentSection: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, paddingBottom: 40 },
  headerGroup: { marginBottom: 40, gap: 12 },
  mainHeading: { fontWeight: '800', fontSize: 50, lineHeight: 60, letterSpacing: -2, color: '#0B1C30', textAlign: 'center' },
  subHeading: { fontWeight: '400', fontSize: 16, lineHeight: 26, color: '#424656', textAlign: 'center', paddingHorizontal: 16 },
  
  detailCard: { backgroundColor: '#EFF4FF', borderWidth: 1, borderColor: 'rgba(194, 198, 216, 0.15)', borderRadius: 32, padding: 32, gap: 16, marginBottom: 48 },
  classNameLabel: { fontWeight: '700', fontSize: 10, letterSpacing: 2, color: '#727687', textTransform: 'uppercase' },
  classNameText: { fontWeight: '700', fontSize: 18, color: '#0B1C30', letterSpacing: -0.4 },
  
  codeBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 24, borderRadius: 24, shadowColor: '#0B1C30', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.06, shadowRadius: 32, elevation: 4 },
  codeLeft: { gap: 8 },
  codeLabel: { fontWeight: '700', fontSize: 10, letterSpacing: 2, color: '#727687', textTransform: 'uppercase' },
  codeText: { 
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', 
    fontWeight: '700', 
    fontSize: 30, 
    letterSpacing: 6, 
    color: '#0050CB' 
  },
  copyBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#DCE9FF', justifyContent: 'center', alignItems: 'center' },
  
  actionCluster: { gap: 24, alignItems: 'center' },
  primaryButton: { width: '100%', paddingVertical: 18, borderRadius: 48, justifyContent: 'center', alignItems: 'center', shadowColor: '#0B1C30', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.06, elevation: 4 },
  primaryButtonText: { fontWeight: '700', fontSize: 16, color: '#FFFFFF' },
  secondaryLink: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8 },
  secondaryLinkText: { fontWeight: '600', fontSize: 16, color: '#0050CB' }
});