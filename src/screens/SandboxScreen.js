import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
// 1. Nhập khẩu cái nút em vừa chế tạo vào đây
import ButtonNice from '../components/Button'; 


export default function SandboxScreen() {
    return (
        <View style={styles.container}>
            {/* 2. Lôi cái nút ra xài thử, bơm dữ liệu giả (mock data) vào để xem nó hiển thị thế nào */}
            <ButtonNice 
                text="Tiếp Tục" 
                onPress={() => Alert.alert("Test", "Nút hoạt động ngon lành!")} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0', // Cho nền màu xám nhạt để cái nút nổi bật lên
        justifyContent: 'center',   // Căn giữa màn hình để dễ ngắm
        alignItems: 'center',
    }
});