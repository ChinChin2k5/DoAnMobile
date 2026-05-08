import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const ButtonNice = ({ 
  text, 
  onPress, 
  iconName, // Truyền tên icon vào đây (vd: 'settings', 'user')
  iconPosition = 'right', // Mặc định là bên phải nếu không truyền gì
  customStyle, //Style đè sau sẽ đè thằng đè trước
  customTextStyle,
  iconColor = "white", // CỬA HẬU MỚI: Mặc định là trắng, truyền màu khác sẽ tự đổi!
}) => {
  return (
    <TouchableOpacity style={[styles.buttonBetter,customStyle, customTextStyle]} onPress={onPress}>
      
      {/* CÁNH TAY ROBOT SỐ 1: BẮT ĐIỀU KIỆN ICON BÊN TRÁI */}
      {/* Lệnh này dịch ra là: Nếu iconPosition là 'left' VÀ có truyền tên icon thì mới vẽ */}
      {iconPosition === 'left' && iconName && (
        <MaterialIcons
          name={iconName}
          size={20}
          color={iconColor}
          style={{ marginRight: 8 }} // Icon bên trái thì cách chữ ra 1 đoạn ở bên phải
        />
      )}

      {/* CHỮ LUÔN Ở GIỮA TRONG HỆ THỐNG */}
      <Text style={[styles.textStyle,customTextStyle]}>{text}</Text>

      {/* CÁNH TAY ROBOT SỐ 2: BẮT ĐIỀU KIỆN ICON BÊN PHẢI */}
      {iconPosition === 'right' && iconName && (
        <MaterialIcons
          name={iconName}
          size={20}
          color={iconColor}
          style={{ marginLeft: 8 }} // Icon bên phải thì cách chữ ra 1 đoạn ở bên trái
        />
      )}

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonBetter: {
    width: 300,
    height: 55,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row", // Cốt lõi là ở đây: Các khối bên trong sẽ nằm ngang hàng
    borderRadius: 30,
    elevation: 3,
  },
  textStyle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
  },
});

export default ButtonNice;
