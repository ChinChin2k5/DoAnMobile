import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

export default function Dashboard_GiangVien_Dummy({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Bảng điều khiển Giảng viên</Text>
      <TouchableOpacity 
        style={styles.btn} 
        onPress={() => navigation.navigate('Tao_De_Thi_Part1')}
      >
        <Text style={styles.btnText}>+ Tạo đề thi mới</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  btn: { backgroundColor: '#3b82f6', padding: 15, borderRadius: 12 },
  btnText: { color: 'white', fontWeight: 'bold' }
});