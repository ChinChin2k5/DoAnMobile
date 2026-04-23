import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import ButtonNice from "../components/Button";
import Container from "../components/Container";
export default function Onboarding3() {
  return (
    <View>
      <Image
        source={require("../assets/Onboarding3.png")}
        style={{ width: "100%", marginTop: 75 }}
      />
      <Container>
        <Text style={styles.bigText}>Quản lý học sinh và theo dõi tiến độ</Text>
        <Text style={styles.smallText}>
          Hệ thống lưu trữ thông minh giúp bạn nắm bắt lộ trình học tập của từng
          cá nhân một cách trực quan và dễ dàng
        </Text>
      </Container>
      <View style={styles.superCenter}>
        <ButtonNice text="Bắt Đầu Ngay" />
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
    fontWeight: "bold",
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
});
