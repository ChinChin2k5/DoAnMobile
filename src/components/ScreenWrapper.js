import React from 'react';
import { StyleSheet  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
//Hàm này được xây dựng để tránh tai thỏ, set backgroundColor mặc định đề phòng trường hợp quên set màu
export default function ScreenWrapper({children, backgroundColor = 'f8f9fa'}) {
    return (
        <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>
            {/*children là một prop đặc biệt, cho phép tái sử dụng code nhiều lần*/}
            {children}
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    safeArea: {
        //Để kéo dãn 100% màn hình
        flex: 1,
    }
})