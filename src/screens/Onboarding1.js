import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import ButtonNice from "../components/Button";
export default function Onboarding1() {
  return (
    <View style={styles.background}>
      <Image
        source={require("../assets/Onboarding1.png")}
        style={{ width: "100%", resizeMode: "contain" }}
      />
      <View style={styles.globalPadding}>
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
        <View style={styles.mrButton}>
          <ButtonNice text="Tiếp Tục" />
        </View>
        <View style={styles.mrInvisible}>
            <TouchableOpacity>
                <Text style={styles.textInvisible}>Bỏ Qua</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  bigText: {
    fontWeight: "bold",
    fontSize: 35,
  },
  colorText: {
    color: "#0050CB",
  },
  smallText: {
    fontSize: 19,
  },
  globalPadding: {
    paddingHorizontal: 20,
  },
  background: {
    flex: 1,
    backgroundColor: "white",
  },
  mrButton: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  mrInvisible: {
    alignItems: "center",
  },
  textInvisible: {
    fontSize: 20,
    marginBottom: 50,
  }
});
