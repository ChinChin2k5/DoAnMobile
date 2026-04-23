import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import ButtonNice from "../components/Button";
import Container from "../components/Container";
export default function Onboarding2() {
    return (
        <View style={styles.background}>
            <Image
              source={require('../assets/Onboarding2.png')}
              style={{width:'100%', marginTop: 75,}}
            />
            <Container>
                <Text style={styles.bigText}>AI hỗ trợ gợi ý câu hỏi thông mình</Text>
                <Text style={styles.smallText}>Hệ thống tự động phân tích và tạo ra bộ câu hỏi sát thực tế giúp bạn ôn luyện hiệu quả hơn bao giờ hết</Text>
            </Container>
        </View>
    );
}
const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#E5EEFF',
    },
    bigText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 35,
    }
})