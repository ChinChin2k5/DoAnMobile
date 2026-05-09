import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image, Alert } from "react-native"; 
import { MaterialIcons, Feather } from "@expo/vector-icons"; 
import { useNavigation } from "@react-navigation/native";

export default function Header({ 
  title = "Tiêu Đề", 
  leftIcon = "arrow-back", 
  showBell = true,         
  onLeftPress = false,             
}) {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onLeftPress) {
      onLeftPress(); 
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleAvatarPress = () => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn đăng xuất không?", 
      [
        {
          text: "Hủy",
          style: "cancel", 
        },
        {
          text: "Đăng xuất",
          style: "destructive", 
          onPress: () => {
            console.log("Đã bấm đăng xuất!");
            navigation.navigate("Login");
          },
        },
      ]
    );
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
            <Feather name="bell" size={20} color="#495D7A" /> 
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.avatarBorder} onPress={handleAvatarPress}>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} 
            style={styles.avatarImage}
          />
        </TouchableOpacity>
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
    alignItems: "center" 
  },
  leftRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 12, 
    flex: 1, 
  },
  titleText: { 
    fontWeight: "800", 
    fontSize: 18,
    color: '#084CCB', 
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
    borderColor: '#D3E0F7', 
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