import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import ButtonNice from '../components/Button'; 


export default function SandboxScreen() {
    return (
        <View style={styles.container}>
            {/* 2.Bơm dữ liệu giả (mock data) vào để xem nó hiển thị thế nào */}
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
        backgroundColor: '#f0f0f0', 
        justifyContent: 'center',   
        alignItems: 'center',
    }
});