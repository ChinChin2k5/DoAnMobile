import React, { useEffect } from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next'; 
export default function LoadingScreen({navigation}) {
    const { i18n } = useTranslation();
    useEffect(() => {
        const bootAppSystem = async () => {
          try {
            console.log("LoadingScreen: Đang kiểm tra ổ cứng...");
            // Ép hệ thống phải đọc ổ cứng trước 
            const savedLang = await AsyncStorage.getItem("settings.lang");
            
            if (savedLang) {
              await i18n.changeLanguage(savedLang);
              console.log("LoadingScreen: Đã nạp ngôn ngữ: ", savedLang);
            } else {
              await i18n.changeLanguage('vi');
            }
            // Cài một cái đồng hồ 2.5 giây để khoe cái Logo Atoza cho đẹp, rồi mới chuyển trang
            setTimeout(() => {
                navigation.replace("FirstOnboarding"); 
            }, 2500); 
          } catch (error) {
            console.log("Lỗi khởi động hệ thống:", error);
            // Lỗi thì cũng cho qua luôn, không để kẹt ở màn loading
            navigation.replace("FirstOnboarding"); 
          }
        };
        bootAppSystem(); 
    }, []); // Chỉ cần MỘT cái useEffect duy nhất!
    return (
        <View style={styles.superBg}>
            <View>
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