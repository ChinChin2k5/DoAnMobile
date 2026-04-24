import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

// Cắt bớt prop iconName đi vì Design không xài icon bên trái
const AppDropdown = ({ label, data, value, onChange }) => {
  return (
    <View style={styles.container}>
      {/* Label chuẩn UI: In hoa, Xanh, Đậm */}
      <Text style={styles.label}>{label}</Text>
      
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconStyle}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select..."
        value={value}
        onChange={onChange}
        // Đã xóa renderLeftIcon để UI sạch sẽ giống hình
      />
    </View>
  );
};

export default AppDropdown;

const styles = StyleSheet.create({
  container: { 
    marginBottom: 20 // Tăng khoảng cách giữa các trường cho thoáng
  },
  label: {
    fontSize: 11, // Chữ nhỏ nhắn
    color: '#1555D4', // Màu xanh dương đậm như Figma
    marginBottom: 8,
    fontWeight: '700', // In đậm
    textTransform: 'uppercase', // Ép in hoa toàn bộ
    letterSpacing: 1.2, // Kéo dãn khoảng cách giữa các chữ cái (quan trọng)
  },
  dropdown: {
    height: 56, // Hộp khá to và bự
    backgroundColor: '#F3F6FA', // Màu nền xanh xám nhạt (Thay cho Border)
    borderRadius: 12, // Bo góc tròn xoe
    paddingHorizontal: 16,
    // Tuyệt đối không xài borderWidth hay borderColor ở đây nữa
  },
  placeholderStyle: { 
    fontSize: 15, 
    color: '#49454F' 
  },
  selectedTextStyle: { 
    fontSize: 15, 
    color: '#1C1B1F',
    fontWeight: '500',
  },
  iconStyle: { 
    width: 24, 
    height: 24,
    tintColor: '#5F6368', // Chỉnh màu cái mũi tên thả xuống thành xám
  },
});