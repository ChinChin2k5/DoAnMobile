import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import ButtonNice from "../components/Button";
import Container from "../components/Container";
export default function Onboarding1({ navigation }) {
  return (
    <View style={styles.background}>
      <Image
        source={require("../assets/Onboarding1.png")}
        style={{ width: "100%" }}
      />
      <Container>
        <Image
          source={require("../assets/logo.png")}
          style={{
            width: "40%",
            height: "20%",
            resizeMode: "contain",
            backgroundColor: "white",
          }}
        />
        <Text style={styles.bigText}>
          Chào mừng đến với <Text style={styles.colorText}>Atoza.</Text>
        </Text>
        <Text style={styles.smallText}>
          Tạo đề thi dễ dàng hơn bao giờ hết với công cụ thông minh dành cho
          giáo viên hiện đại
        </Text>
        <Image 
          source={require("../assets/Progress1.png")}
          style={{marginTop: 5}}/>
        <View style={styles.mrButton}>
          <ButtonNice 
            text="Tiếp Tục"
            onPress={() => navigation.navigate("SecondOnboarding")} />
        </View>
        <View style={styles.mrInvisible}>
            <TouchableOpacity>
                <Text style={styles.textInvisible}>Bỏ Qua</Text>
            </TouchableOpacity>
        </View>
      </Container>
    </View>
  );
}
const styles = StyleSheet.create({
  bigText: {
    fontFamily: "Inter-ExtraBold",
    fontSize: 35,
  },
  colorText: {
    color: "#0050CB",
  },
  smallText: {
    fontFamily: "Inter-Regular",
    fontSize: 18,
  },
  background: {
    flex: 1,
    backgroundColor: "white",
  },
  mrButton: {
    alignItems: "center",
    marginTop: 20,
  },
  mrInvisible: {
    alignItems: "center",
    marginTop: 20,
  },
  textInvisible: {
    fontSize: 20,
    marginBottom: 50,
  }
});
