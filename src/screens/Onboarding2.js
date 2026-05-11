import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import ButtonNice from "../components/Button";
import Container from "../components/Container";
import { useTranslation } from 'react-i18next';
export default function Onboarding2({ navigation }) {
  const { t } = useTranslation();
  return (
    <View style={styles.background}>
      <Image
        source={require("../assets/Onboarding2.png")}
        style={{ width: "100%", marginTop: 75 }}
      />
      <Container>
        <Text style={styles.bigText}>{t("onboarding2.bigText")}{"\n"} 
        <Text style={styles.blueBigText}>{t("onboarding2.blueBigText")}</Text></Text>
        <Text style={styles.smallText}>
        {t("onboarding2.smallText")}
        </Text>
        <View style={styles.imageCenter}>
        <Image
          source={require("../assets/Progress2.png")}
          style={{marginTop: 10}}
        />
        </View>
      </Container>
      <View style={styles.superCenter}>
        <ButtonNice text={t("onboarding2.buttonNext")}
        onPress={() => navigation.navigate("ThirdOnboarding")}
        iconName="arrow-forward"/>
      </View>
      <View style={styles.mrInvisible}>
        <TouchableOpacity
        onPress={() => navigation.navigate("Login")}>
          <Text style={styles.textInvisible}>{t("onboarding2.buttonSkip")}</Text>
        </TouchableOpacity>
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
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    marginTop: 15,
  },
  mrInvisible: {
    alignItems: "center",
    marginTop: 20,
  },
  textInvisible: {
    fontSize: 20,
    marginBottom: 50,
  },
  superCenter: {
    alignItems: "center",
    marginTop: 20,
  },
  imageCenter: {
    alignItems: 'center',
  },
  blueBigText: {
    color: '#0050CB',
  }
});
