// Screens_Duy/Ket_Qua_Dummy.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Ket_Qua_Dummy({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Ionicons name="checkmark-done-circle" size={80} color="#10b981" />
                <Text style={styles.title}>Nộp bài thành công!</Text>
                <Text style={styles.subtitle}>
                    Bài thi này cho phép làm lại nhiều lần. Để đảm bảo tính công bằng, hệ thống sẽ không hiển thị chi tiết đáp án lúc này.
                </Text>
                
                <TouchableOpacity 
                    style={styles.btnPrimary} 
                    onPress={() => navigation.navigate('MainTabs')}
                >
                    <Text style={styles.btnText}>Trở về Dashboard</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#0f172a', marginTop: 20, marginBottom: 10 },
    subtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 22, marginBottom: 40 },
    btnPrimary: { backgroundColor: '#3b82f6', paddingVertical: 14, paddingHorizontal: 30, borderRadius: 12, width: '100%', alignItems: 'center' },
    btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});