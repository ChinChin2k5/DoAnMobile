import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import ButtonNice from "../components/Button";
import Container from "../components/Container";
import { useTranslation } from "react-i18next";

export default function Onboarding1({ navigation }) {
  const { t } = useTranslation();
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
          {t("onboarding1.welcome")}
          <Text style={styles.colorText}>Atoza.</Text>
        </Text>
        <Text style={styles.smallText}>{t("onboarding1.smallText")}</Text>
        <Image
          source={require("../assets/Progress1.png")}
          style={{ marginTop: 5 }}
        />
        <View style={styles.mrButton}>
          <ButtonNice
            text={t("onboarding1.buttonNext")}
            onPress={() => navigation.navigate("SecondOnboarding")}
            iconName="arrow-forward"
          />
        </View>
        <View style={styles.mrInvisible}>
          <TouchableOpacity>
            <Text style={styles.textInvisible}>
              {t("onboarding1.buttonSkip")}
            </Text>
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
  },
});
