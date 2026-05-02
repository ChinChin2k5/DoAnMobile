import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons"; // Thêm Feather cho cái chuông
import { useNavigation } from "@react-navigation/native";

// BIẾN COMPONENT THÀNH PROPS
export default function Header({ 
  title = "Tiêu Đề", 
  leftIcon = "arrow-back", // Mặc định là mũi tên lùi, có thể truyền "grid-view" vào
  showBell = true,         // Có muốn hiện chuông không?
  onLeftPress = false,            // Lệnh chạy khi bấm nút trái (nếu không truyền sẽ tự goBack)
}) {
  const navigation = useNavigation();

  // Xử lý luồng bấm nút trái
  const handlePress = () => {
    if (onLeftPress) {
      onLeftPress(); 
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.header, styles.globalPadding, styles.globalBetween]}>
      
      {/* ================================ */}
      {/* CỤM BÊN TRÁI: ICON + TIÊU ĐỀ XANH */}
      {/* ================================ */}
      <TouchableOpacity style={styles.leftRow} onPress={handlePress}>
        <MaterialIcons name={leftIcon} size={24} color="#084CCB" />
        <Text style={styles.titleText}>{title}</Text>
      </TouchableOpacity>

      {/* ================================ */}
      {/* CỤM BÊN PHẢI: CHUÔNG + AVATAR    */}
      {/* ================================ */}
      <View style={styles.rightRow}>
        {showBell && (
          <TouchableOpacity style={styles.bellIcon}>
            {/* Icon chuông chuẩn Figma */}
            <Feather name="bell" size={20} color="#495D7A" /> 
          </TouchableOpacity>
        )}
        
        {/* Vòng tròn bọc Avatar (Thay cho cục A màu tím cũ) */}
        <View style={styles.avatarBorder}>
          <Image 
            // Nhét tạm cái ảnh test này vào, sau này gọi API user để đắp vào sau
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} 
            style={styles.avatarImage}
          />
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  header: { 
    marginTop: 10, 
    paddingVertical: 10,
    backgroundColor: 'transparent'
  },
  globalPadding: { paddingHorizontal: 15 },
  globalBetween: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center" // Ép tất cả căn giữa theo chiều dọc
  },
  leftRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 12, 
    flex: 1, // Đẩy thằng này ăn hết khoảng trống để chữ được phép xuống dòng
  },
  titleText: { 
    fontWeight: "800", // In đậm dày cộp
    fontSize: 18,
    color: '#084CCB', // Chữ xanh Enterprise
    textTransform: 'capitalize',
  },
  rightRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bellIcon: {
    padding: 5,
  },
  avatarBorder: {
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    borderWidth: 1,
    borderColor: '#D3E0F7', // Cái viền xanh nhạt nhạt bọc ngoài Avatar
    justifyContent: 'center', 
    alignItems: 'center', 
    overflow: 'hidden',
  },
  avatarImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
  }
});