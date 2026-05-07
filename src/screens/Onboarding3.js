import React from "react";
import { View, StyleSheet, Text, Image, ImageBackground } from "react-native";
import ButtonNice from "../components/Button";
import Container from "../components/Container";
import { useTranslation } from 'react-i18next';
export default function Onboarding3({navigation}) {
  const { t } = useTranslation();
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
        <Text style={styles.bigText}>{t("onboarding3.bigText")}</Text>
        <Text style={styles.smallText}>
        {t("onboarding3.smallText")}
        </Text>
      </Container>
      <View style={styles.superCenter}>
        <ButtonNice text={t("onboarding3.superCenter")}
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
