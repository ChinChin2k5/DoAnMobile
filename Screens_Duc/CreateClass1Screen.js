// screens/CreateClass1Screen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  SafeAreaView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function CreateClass1Screen({ navigation }) {
  const [className, setClassName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#0050CB');
  const [selectedLevel, setSelectedLevel] = useState('High School - Year 12');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const colors = ['#0050CB', '#34D399', '#F59E0B', '#F43F5E', '#8B5CF6'];

  const handleCreateClass = async () => {
    if (!className.trim()) {
      Alert.alert('Error', 'Please enter a class name');
      return;
    }

    setIsLoading(true);
    try {
      const classData = {
        className: className.trim(),
        themeColor: selectedColor,
        level: selectedLevel,
        description: description.trim(),
      };

      navigation.navigate('CreateClass2', { classData });
    } catch (error) {
      Alert.alert('Error', error.message);
      setIsLoading(false);
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
        <View style={styles.profileBorder}>
          <Image source={{ uri: 'https://i.pravatar.cc/150?u=teacher' }} style={styles.profilePic} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header & Progress */}
        <View style={styles.headerSection}>
          <Text style={styles.mainHeading}>Design your new classroom</Text>
          <Text style={styles.subHeading}>Let's set up the digital foundation for your students' learning journey.</Text>
        </View>

        {/* Section 1: Identity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconOverlay}>
              <Ionicons name="school" size={16} color="#0050CB" />
            </View>
            <Text style={styles.sectionTitle}>Identity</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CLASS NAME</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g., Mathematics 12A" 
              placeholderTextColor="#C2C6D8"
              value={className}
              onChangeText={setClassName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>THEME COLOR</Text>
            <View style={styles.colorRow}>
              {colors.map((c) => (
                <TouchableOpacity 
                  key={c} 
                  style={[styles.colorOption, { backgroundColor: c }, selectedColor === c && styles.colorOptionActive]}
                  onPress={() => setSelectedColor(c)}
                >
                  {selectedColor === c && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.dropdownInput}>
            <Text style={styles.dropdownText}>{selectedLevel}</Text>
            <Ionicons name="chevron-down" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Section 2: Description */}
        <View style={styles.section}>
          <Text style={styles.label}>DESCRIPTION</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            placeholder="Briefly describe the syllabus, learning goals, or classroom culture..." 
            placeholderTextColor="#C2C6D8"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Section 3: Add Students */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconOverlay, { backgroundColor: 'rgba(67, 69, 209, 0.1)' }]}>
              <Ionicons name="people" size={16} color="#4345D1" />
            </View>
            <Text style={styles.sectionTitle}>Add Students</Text>
          </View>

          {/* Cards Container */}
          <View style={styles.cardsRow}>
            {/* Card 1: Email */}
            <TouchableOpacity style={styles.methodCard} activeOpacity={0.8}>
              <Ionicons name="mail" size={24} color="#0050CB" />
              <View style={styles.methodCardText}>
                <Text style={styles.methodTitle}>Invite via Email</Text>
                <Text style={styles.methodDesc}>Directly invite students to join via their academic email addresses.</Text>
              </View>
            </TouchableOpacity>

            {/* Card 2: CSV */}
            <TouchableOpacity style={styles.methodCard} activeOpacity={0.8}>
              <Ionicons name="document-text" size={24} color="#00629E" />
              <View style={styles.methodCardText}>
                <Text style={styles.methodTitle}>Upload CSV</Text>
                <Text style={styles.methodDesc}>Import your entire class list from an Excel or Google Sheets file.</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Spacer for Sticky CTA */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View style={styles.stickyCTA}>
        <TouchableOpacity style={{ width: '100%' }} onPress={handleCreateClass} disabled={isLoading}>
          <LinearGradient colors={['#0050CB', '#0066FF']} style={[styles.ctaButton, isLoading && { opacity: 0.6 }]}>
            <Text style={styles.ctaButtonText}>{isLoading ? 'Creating...' : 'Create Classroom'}</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FF' },
  topAppBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 12, backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 10 },
  iconButton: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  logoText: { fontWeight: '700', fontSize: 20, color: '#1D4ED8', letterSpacing: -0.5 },
  profileBorder: { borderWidth: 2, borderColor: '#D3E4FE', borderRadius: 20, padding: 2 },
  profilePic: { width: 32, height: 32, borderRadius: 16 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 24 },
  headerSection: { gap: 16, marginBottom: 40 },
  mainHeading: { fontWeight: '800', fontSize: 44, lineHeight: 48, letterSpacing: -1.1, color: '#0B1C30' },
  subHeading: { fontWeight: '400', fontSize: 18, lineHeight: 29, color: '#424656' },
  section: { gap: 16, marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  iconOverlay: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0, 80, 203, 0.1)', justifyContent: 'center', alignItems: 'center' },
  sectionTitle: { fontWeight: '700', fontSize: 20, color: '#0B1C30', letterSpacing: -0.5 },
  inputGroup: { gap: 8 },
  label: { fontWeight: '700', fontSize: 11, color: '#727687', letterSpacing: 1.1, textTransform: 'uppercase' },
  input: { backgroundColor: '#EFF4FF', borderRadius: 16, padding: 18, fontSize: 16, color: '#0B1C30' },
  textArea: { height: 120, textAlignVertical: 'top' },
  colorRow: { flexDirection: 'row', gap: 12, paddingVertical: 8 },
  colorOption: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  colorOptionActive: { borderWidth: 3, borderColor: '#DCE9FF' },
  dropdownInput: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#EFF4FF', borderRadius: 16, padding: 18, marginTop: 8 },
  dropdownText: { fontSize: 16, color: '#0B1C30' },
  cardsRow: { flexDirection: 'row', gap: 16 },
  methodCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(194, 198, 216, 0.15)', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, elevation: 1, gap: 12 },
  methodTitle: { fontWeight: '700', fontSize: 14, color: '#0B1C30', marginBottom: 4 },
  methodDesc: { fontSize: 11, color: '#424656', lineHeight: 16 },
  stickyCTA: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: 24, borderTopWidth: 1, borderTopColor: '#E5EEFF' },
  ctaButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 20, borderRadius: 9999, gap: 12 },
  ctaButtonText: { fontWeight: '700', fontSize: 18, color: '#FFFFFF' }
});