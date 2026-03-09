import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function TestScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đây là màn hình Làm Bài Thi!</Text>
      
      {/* Nút để quay lại HomeScreen */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>Quay lại trang chủ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  backButton: {
    padding: 15,
    backgroundColor: '#ef4444',
    borderRadius: 8,
  },
  backText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});