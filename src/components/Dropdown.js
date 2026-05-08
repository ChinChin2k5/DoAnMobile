import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const AppDropdown = ({ label, data, value, onChange }) => {
  return (
    <View style={styles.container}>
      {/* Label chuẩn UI: In hoa, Xanh, Đậm, Khoảng cách rộng */}
      <Text style={styles.label}>{label}</Text>
      
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconStyle}
        // Style cho cái menu khi xổ xuống cho đồng bộ
        containerStyle={styles.dropdownContainer} 
        itemTextStyle={styles.itemText}
        activeColor="#E8EFFB" // Màu nền nhẹ khi bấm chọn item

        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Chọn..." // Chuyển sang Tiếng Việt
        value={value}
        onChange={onChange}
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
    fontSize: 10, // Chữ nhỏ nhắn, tinh tế hơn xíu
    color: '#084CCB', // Màu xanh dương đậm chuẩn Figma (Xanh hơn màu cũ của em)
    marginBottom: 10, // Tăng khoảng cách label xuống ô input
    fontWeight: '700', // Rất đậm
    textTransform: 'uppercase', // Ép in hoa
    letterSpacing: 1.5, // Kéo dãn khoảng cách chữ, cực kỳ quan trọng
  },
  dropdown: {
    height: 56, // Hộp to, bự, tạo cảm giác chắc chắn
    backgroundColor: '#EEF2F9', // Màu nền xanh xám nhạt chuẩn Figma (Tươi hơn màu của em)
    borderRadius: 16, // Bo góc tròn xoe bự hơn (Figma xài bo góc lớn)
    paddingHorizontal: 20, // Tăng padding bên trong cho thoáng
    // Đã xóa borderWidth hoàn toàn
  },
  placeholderStyle: { 
    fontSize: 15, 
    color: '#6F7F91' // Màu placeholder xám nhẹ, không quá đậm
  },
  selectedTextStyle: { 
    fontSize: 15, 
    color: '#1A2134', // Màu chữ chọn đậm, sắc nét
    fontWeight: '500',
  },
  iconStyle: { 
    width: 22, 
    height: 22,
    tintColor: '#5F6368', // Màu mũi tên xám nhẹ
  },
  // Style bổ sung cho menu xổ xuống
  dropdownContainer: {
    borderRadius: 12,
    marginTop: 5,
    elevation: 4, // Đổ bóng cho Android nhìn xịn hơn
    shadowColor: '#000', // Đổ bóng cho iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemText: {
    fontSize: 15,
    color: '#1A2134',
  },
});