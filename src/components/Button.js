import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Feather } from "@expo/vector-icons";
//Em đang muốn khai báo các props cho biến Button này, đồng thời kích hoạt khả năng OnPress của Button
//Và em đang chọn Text là props duy nhất đảm nhận cái này
const ButtonNice = ({text,onPress}) => {
    return (
        <TouchableOpacity 
        style={styles.buttonBetter}>
        <Text style={styles.textStyle}>{text}</Text>
        <Feather name="chevron-right" size={20} color="white" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    buttonBetter: {
        width: 300,           // Cho to ra tí cho dễ bấm
        height: 55,           // Đủ độ cao của ngón tay
        backgroundColor: "#3B82F6", // ĐỔ MÀU VÀO! Không có màu là tàng hình!
        justifyContent: 'center',   // Căn chữ ra giữa theo chiều dọc
        alignItems: 'center',       // Căn chữ ra giữa theo chiều ngang
        borderRadius: 30,            // Bo góc cho nó giống "Premium"
        elevation: 3,               // Đổ bóng nhẹ (trên Android)
    },
    textStyle: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
    }
});
export default ButtonNice;
