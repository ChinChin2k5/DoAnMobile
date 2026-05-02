import React from "react";
import { View, StyleSheet, Text, Image, ImageBackground } from "react-native";
import ButtonNice from "../components/Button";
import Container from "../components/Container";
export default function Onboarding3({navigation}) {
  return (
    <View>
      <ImageBackground
        source={require("../assets/Onboarding3.png")}
        style={{ width: "100%", height: 420, marginTop: 75 }}
      >
        <View style={styles.imageCenter}>
        <Image
          source={require("../assets/Progress3.png")}
          />
        </View>
      </ImageBackground>
      
      <Container>
        <Text style={styles.bigText}>Quản lý học sinh và theo dõi tiến độ</Text>
        <Text style={styles.smallText}>
          Hệ thống lưu trữ thông minh giúp bạn nắm bắt lộ trình học tập của từng
          cá nhân một cách trực quan và dễ dàng
        </Text>
      </Container>
      <View style={styles.superCenter}>
        <ButtonNice text="Bắt Đầu Ngay"
         onPress={() => navigation.reset({
          index: 0, // Chỉ định đĩa nào sẽ nằm trên cùng (thường là 0)
          routes: [
            { name: 'DashboardAdmin' }, // Đây là danh sách các đĩa mới. 
          ],
        })} 
        iconName="arrow-forward"/>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#E5EEFF",
  },
  bigText: {
    textAlign: "center",
    fontFamily: 'Inter-ExtraBold',
    fontSize: 35,
  },
  smallText: {
    textAlign: "center",
    fontSize: 15,
    marginTop: 16
  },
  superCenter: {
    alignItems: "center",
    marginTop: 40,
  },
  imageCenter: {
    alignItems: 'center',
  }
});
