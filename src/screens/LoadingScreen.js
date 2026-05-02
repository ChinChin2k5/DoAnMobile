import React, { useEffect } from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
export default function LoadingScreen({navigation}) {
    //Bản chất useEffect: màn hình render xong mới bấm 3 giây chạy
    useEffect(() => {
        // Thiết lập đồng hồ 3 giây (3000ms)
        const timer = setTimeout(() => {
            // Dùng lệnh .replace thay vì .navigate để người dùng không bấm Back quay lại màn Loading được
            navigation.replace("FirstOnboarding");
        }, 3000);
        // Nếu không có clearTimeout => hàm replace vẫn chạy => Nổ app
        return () => clearTimeout(timer);
        // Dấu [] báo cho Screen biết rằng hàm setTimeout chỉ được phép dùng 1 lần duy nhất sau khi được render
    }, []);
    return (
        <View style={styles.superBg}>
        <View>
            {/*Lùi ra một cấp*/}
            <Image source={require('../assets/Background.png')} alt="Logo"/>
            <Text style={styles.logoText}>ATOZA</Text>
        </View>
    </View>
    )
}
const styles = StyleSheet.create({
    superBg: {
        flex: 1,
        backgroundColor: "#3B82F6",
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontWeight: 'bold',
        fontSize: 30,
        color: 'white',
    },
});