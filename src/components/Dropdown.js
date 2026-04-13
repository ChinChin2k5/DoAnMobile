import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Định nghĩa các biến (props) để tái sử dụng
const AppDropdown = ({ label, data, value, onChange, iconName = "form-select" }) => {
  return (
    <View style={styles.container}>
      {/* Nhãn của Dropdown - giả lập label của React Native Paper */}
      <Text style={styles.label}>{label}</Text>
      
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Chọn giá trị..."
        value={value}
        onChange={onChange}
        renderLeftIcon={() => (
          <MaterialCommunityIcons style={styles.icon} color="#9333EA" name={iconName} size={20} />
        )}
      />
    </View>
  );
};

export default AppDropdown;

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  label: {
    fontSize: 12,
    color: 'black',
    marginBottom: 4,
    fontWeight: '500',
    marginLeft: 4
  },
  dropdown: {
    height: 50,
    borderColor: '#79747E', // Màu border chuẩn Material Design Outlined
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    backgroundColor: 'white',
  },
  icon: { marginRight: 10 },
  placeholderStyle: { fontSize: 16, color: '#49454F' },
  selectedTextStyle: { fontSize: 16, color: '#1C1B1F' },
  iconStyle: { width: 20, height: 20 },
});