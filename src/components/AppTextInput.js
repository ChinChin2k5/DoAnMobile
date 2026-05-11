import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';

const AppTextInput = ({ label, value, onChangeText, placeholder, ...props }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#6F7F91"
        {...props}
      />
    </View>
  );
};

export default AppTextInput;

const styles = StyleSheet.create({
  container: { 
    marginBottom: 20 
  },
  label: {
    fontSize: 11, 
    color: '#084CCB', 
    marginBottom: 8, 
    fontWeight: '700', 
    textTransform: 'uppercase', 
    letterSpacing: 1.2, 
  },
  input: {
    height: 56, 
    backgroundColor: '#F3F6FA', 
    borderRadius: 12, 
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1A2134',
    fontWeight: '500',
  },
});